import React, { useState, useEffect } from "react";
import {Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, Typography, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import api from "../../api";

const AffectList = () => {
  const [affectations, setAffectations] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState("");
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prestRes, response] = await Promise.all([
          api.get("/affectation/prestataires"),
          api.get("/affectation/affects"),
        ]);
        console.log("Prestataires:", prestRes.data);
        console.log("Affectations:", response.data);
        setPrestataires(prestRes.data);
        setAffectations(response.data);
      } catch (error) {
        console.error("Error fetching affectations:", error);
      }
    };
    fetchData();
  }, []);
  

  const handleOpen = (affectation) => {
    setSelectedAffectation(affectation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAffectation(null);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Liste des Affectations
      </Typography>
      <FormControl fullWidth style={{ marginBottom: "20px" }}>
        <InputLabel id="prestataire-select-label">Filtrer par Prestataire</InputLabel>
        <Select
          labelId="prestataire-select-label"
          value={selectedPrestataire}
          label="Filtrer par Prestataire"
          onChange={(e) => setSelectedPrestataire(e.target.value)}
        >
          <MenuItem value="">Tous les Prestataires</MenuItem>
          {prestataires.map((prest) => (
            <MenuItem key={prest.id} value={prest.id}>
              {prest.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Demande Audit ID</TableCell>
              <TableCell>Prestataire</TableCell>
              <TableCell>Nombre d'Auditeurs</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {affectations
              .filter((affect) => selectedPrestataire === "" || affect.prestataire_id === selectedPrestataire)
              .map((affect) => (
                <TableRow key={affect.id}>
                  <TableCell>{affect.id}</TableCell>
                  <TableCell>{affect.demande_audit_id}</TableCell>
                  <TableCell>
                    {prestataires.find((p) => p.id === affect.prestataire_id)?.nom || "N/A"}
                  </TableCell>
                  <TableCell>{affect.auditeurs.length}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpen(affect)}>
                      Voir Détails
                    </Button>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedAffectation && (
            <>
              <Typography variant="h6">Détails de l'Affectation</Typography>
              <Typography><strong>ID:</strong> {selectedAffectation.id}</Typography>
              <Typography><strong>Audit ID:</strong> {selectedAffectation.audit_id}</Typography>
              <Typography>
                <strong>Prestataire:</strong>{" "}
                {prestataires.find((p) => p.id === selectedAffectation.prestataire_id)?.nom || "Inconnu"}
              </Typography>
              <Typography><strong>Auditeurs:</strong></Typography>
              <ul>
                {selectedAffectation.auditeurs.map((auditor) => (
                  <li key={auditor.id}>{auditor.nom} {auditor.prenom} ({auditor.email})</li>
                ))}
              </ul>
              <Typography><strong>Les Adresses IPs:</strong></Typography>
              <ul>
                <ul>
                  {selectedAffectation.ips.map((ip, index) => (
                    <li key={index}>
                      {ip.adresse_ip} : {ip.ports.map(port => port.port).join(", ")}
                    </li>
                  ))}
                </ul>
              </ul>
              {selectedAffectation.affectationpath && (
                <Typography>
                  <strong>Telecharger la Fiche: </strong> <a href={`http://localhost:8000/${selectedAffectation.affectationpath}`} target="_blank" rel="noopener noreferrer">Télécharger</a>
                </Typography>
              )}
              
              <Button variant="contained" onClick={handleClose} style={{marginTop: "10px"}}>Fermer</Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AffectList;
