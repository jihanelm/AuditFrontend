import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import api from "../../api";

const AffectList = () => {
  const [affectations, setAffectations] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState("");
  const [selectedAffectation, setSelectedAffectation] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingAuditId, setLoadingAuditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prestRes, response] = await Promise.all([
          api.get("/affectation/prestataires"),
          api.get("/affectation/affects"),
        ]);
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

  const handleCommencerAudit = async (affect, e) => {
    e.stopPropagation();
  
    const payload = {
      demande_audit_id: affect.demande_audit_id,
      affectation_id: affect.id,
      prestataire_id: affect.prestataire_id ?? null,
      auditeur_ids: Array.isArray(affect.auditeurs)
        ? affect.auditeurs.filter(a => a && a.id).map(a => a.id)
        : []
    };
  
    console.log("Payload envoyé à /audit/audits/ :", payload);
  
    if (payload.auditeur_ids.length === 0) {
      alert("Aucun auditeur sélectionné !");
      return;
    }
  
    try {
      await api.post("/audit/audits/", payload);
      alert("Audit ajouté au plan avec succès !");
      navigate('/list');
    } catch (error) {
      console.error("Erreur lors de l'ajout au plan :", error.response?.data || error.message);
      alert("Erreur lors de l'ajout au plan.");
    }
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
              .filter(
                (affect) =>
                  selectedPrestataire === "" ||
                  affect.prestataire_id === selectedPrestataire
              )
              .map((affect) => (
                <TableRow key={affect.id}>
                  <TableCell>{affect.id}</TableCell>
                  <TableCell>{affect.demande_audit_id}</TableCell>
                  <TableCell>
                    {prestataires.find((p) => p.id === affect.prestataire_id)?.nom || "N/A"}
                  </TableCell>
                  <TableCell>{affect.auditeurs?.length || 0}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpen(affect)}>
                      Voir Détails
                    </Button>
                    {affect.audit_id ? (
                      <Typography color="green" sx={{ mt: 1 }}>
                        Audit déjà lancé
                      </Typography>
                    ) : (
                      <Button
                        color="secondary"
                        disabled={loadingAuditId === affect.id}
                        onClick={(e) => handleCommencerAudit(affect, e)}
                        sx={{ ml: 1 }}
                      >
                        {loadingAuditId === affect.id ? "En cours..." : "Commencer Audit"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Détails */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
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
                  <li key={auditor.id}>
                    {auditor.nom} {auditor.prenom} ({auditor.email})
                  </li>
                ))}
              </ul>
              <Typography><strong>Les Adresses IPs:</strong></Typography>
              <ul>
                {selectedAffectation.ips.map((ip, index) => (
                  <li key={index}>
                    {ip.adresse_ip} : {ip.ports.map((port) => port.port).join(", ")}
                  </li>
                ))}
              </ul>
              {selectedAffectation.affectationpath && (
                <Typography>
                  <strong>Fiche: </strong>
                  <a
                    href={`http://localhost:8000/${selectedAffectation.affectationpath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger
                  </a>
                </Typography>
              )}
              <Button variant="contained" onClick={handleClose} sx={{ mt: 2 }}>
                Fermer
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default AffectList;
