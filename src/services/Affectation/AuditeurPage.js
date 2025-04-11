import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import api from "../../api";

export default function AuditeurPage() {
  const [auditeurs, setAuditeurs] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState("");
  const [editingAuditeur, setEditingAuditeur] = useState(null);

  useEffect(() => {
    fetchAuditeurs();
    fetchPrestataires();
  }, []);

  const fetchAuditeurs = async () => {
    try {
      const response = await api.get("/affect/auditeurs/");
      setAuditeurs(response.data);
    } catch (error) {
      console.error("Erreur fetchAuditeurs :", error);
    }
  };
  
  const fetchPrestataires = async () => {
    try {
      const response = await api.get("/affect/prestataires/");
      setPrestataires(response.data);
    } catch (error) {
      console.error("Erreur fetchPrestataires :", error);
    }
  };  

  const handleDelete = async (id) => {
    await api.delete(`/affect/auditeurs/${id}`);
    fetchAuditeurs();
  };

  const handleUpdate = async (auditeur) => {
    try {
      const updatedData = {
        nom: auditeur.nom,
        prenom: auditeur.prenom,
        email: auditeur.email,
        phone: auditeur.phone,
        prestataire_id: auditeur.prestataire_id
      };
  
      const response = await api.put(
        `/affect/auditeurs/${auditeur.id}`,
        updatedData
      );
  
    } catch (error) {
      console.error("Erreur handleUpdate :", error.response?.data || error.message);
    }
  };
   

  const filteredAuditeurs = selectedPrestataire
    ? auditeurs.filter((a) => a.prestataire_id === parseInt(selectedPrestataire))
    : auditeurs;

  const columns = [
    {
      field: "check",
      width: "70",
      renderCell: (params) => (
      <Checkbox
        edge="start"
        
        tabIndex={-1}
      />
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "nom", headerName: "Nom", flex: 1 },
    { field: "prenom", headerName: "Prénom", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Téléphone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => setEditingAuditeur(params.row)}>Modifier</Button>
          <Button color="error" onClick={() => handleDelete(params.row.id)}>Supprimer</Button>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Liste des Auditeurs</Typography>

      <Box mb={2} width={300}>
        <Select
          fullWidth
          displayEmpty
          value={selectedPrestataire}
          onChange={(e) => setSelectedPrestataire(e.target.value)}
        >
          <MenuItem value="">Tous les prestataires</MenuItem>
          {prestataires.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.nom}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={filteredAuditeurs} columns={columns} pageSize={7} />
      </div>

      {/* Dialog Modification */}
      <Dialog open={!!editingAuditeur} onClose={() => setEditingAuditeur(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier un auditeur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {["nom", "prenom", "email", "phone"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  label={field.toUpperCase()}
                  value={editingAuditeur?.[field] || ""}
                  onChange={(e) =>
                    setEditingAuditeur({ ...editingAuditeur, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Select
                fullWidth
                value={editingAuditeur?.prestataire_id || ""}
                onChange={(e) =>
                  setEditingAuditeur({
                    ...editingAuditeur,
                    prestataire_id: parseInt(e.target.value),
                  })
                }
              >
                {prestataires.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nom}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingAuditeur(null)}>Annuler</Button>
          <Button
            onClick={() => handleUpdate(editingAuditeur)}
            variant="contained"
            >
            Enregistrer
            </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
}
