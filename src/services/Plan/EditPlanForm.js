import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import api from "../../api";

const EditPlanForm = ({ plan, open, onClose, fetchPlans }) => {
  const [formData, setFormData] = useState({
    ref: "",
    application: "",
    type_application: "",
    type_audit: "",
    date_realisation: "",
    date_cloture: "",
    date_rapport: "",
    niveau_securite: "",
    nb_vulnerabilites: "",
    taux_remediation: "",
    commentaire_dcsg: "",
    commentaire_cp: "",
    vulnerabilites: [],
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        vulnerabilites: plan.vulnerabilites || [],
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/plan/plans/${plan.id}`, formData);
      alert("Plan modifié avec succès !");
      fetchPlans();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      alert("Erreur lors de la modification !");
    }
  };

  const handleVulnChange = (index, field, value) => {
    const newVulns = [...formData.vulnerabilites];
    newVulns[index][field] = value;
    setFormData({ ...formData, vulnerabilites: newVulns });
  };

  const addVulnField = () => {
    setFormData({
      ...formData,
      vulnerabilites: [
        ...formData.vulnerabilites,
        {
          titre: "",
          criticite: "",
          pourcentage_remediation: 0,
          statut_remediation: "",
          actions: "",
        },
      ],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier le Plan</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Informations Générales</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[
              { label: "Référence", name: "ref" },
              { label: "Application", name: "application" },
              { label: "Type Audit", name: "type_audit" },
              { label: "Date Réalisation", name: "date_realisation", type: "date" },
              { label: "Date Clôture", name: "date_cloture", type: "date" },
              { label: "Date Rapport", name: "date_rapport", type: "date" },
              { label: "Niveau Sécurité", name: "niveau_securite" },
              { label: "Nombre de Vulnérabilités", name: "nb_vulnerabilites" },
              { label: "Taux de Remédiation", name: "taux_remediation" },
              { label: "Commentaires DCSG", name: "commentaire_dcsg" },
              { label: "Commentaires CP", name: "commentaire_cp" },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Vulnérabilités</Typography>
          <Divider sx={{ mb: 2 }} />
          {formData.vulnerabilites.map((vuln, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, borderLeft: '4px solid #1976d2' }}>
              <Typography variant="subtitle1">Vulnérabilité #{index + 1}</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Titre"
                    fullWidth
                    value={vuln.titre}
                    onChange={(e) => handleVulnChange(index, "titre", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Criticité"
                    fullWidth
                    value={vuln.criticite}
                    onChange={(e) => handleVulnChange(index, "criticite", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="% Remédiation"
                    type="number"
                    fullWidth
                    value={vuln.pourcentage_remediation}
                    onChange={(e) =>
                      handleVulnChange(index, "pourcentage_remediation", parseFloat(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Statut Remédiation"
                    fullWidth
                    value={vuln.statut_remediation}
                    onChange={(e) => handleVulnChange(index, "statut_remediation", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Actions"
                    fullWidth
                    value={vuln.actions}
                    onChange={(e) => handleVulnChange(index, "actions", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button variant="outlined" onClick={addVulnField}>
            Ajouter une vulnérabilité
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanForm;
