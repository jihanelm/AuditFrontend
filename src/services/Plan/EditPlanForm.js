import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import api from "../../api";

const EditPlanForm = ({ plan, open, onClose, fetchPlans }) => {
  const [formData, setFormData] = useState({
    ref: "",
    type_audit: "",
    date_debut: "",
    date_realisation: "",
    duree: "",
    date_fin: "",
    status: "",
    remarques: "",
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le Plan</DialogTitle>
      <DialogContent>
        <TextField label="Référence" name="ref" value={formData.ref} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Type Audit" name="type_audit" value={formData.type_audit} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Date Début" name="date_debut" type="date" value={formData.date_debut} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
        <TextField label="Date Réalisation" name="date_realisation" type="date" value={formData.date_realisation} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
        <TextField label="Durée" name="duree" value={formData.duree} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Date Fin" name="date_fin" type="date" value={formData.date_fin} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
        <TextField label="Status" name="status" value={formData.status} onChange={handleChange} fullWidth margin="dense" />
        <TextField label="Remarques" name="remarques" value={formData.remarques} onChange={handleChange} fullWidth margin="dense" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanForm;
