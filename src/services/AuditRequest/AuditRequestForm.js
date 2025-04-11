import { useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Container, CircularProgress, Alert, Box } from "@mui/material";
import api from "../../api";

const AuditRequestForm = () => {
  const [formData, setFormData] = useState({
    demandeur_nom: "",
    demandeur_prenom: "",
    demandeur_email: "",
    demandeur_phone: "",
    demandeur_departement: "",
    type_audit: "",
    description: "",
    objectif: "",
    urgence: "",
    domain_name: "",
    fichier_attache: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, fichier_attache: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      await api.post("/audits/request", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Demande envoyée avec succès !");
    } catch (error) {
      setErrorMessage("Erreur lors de l'envoi de la demande.");
      console.error(error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Demande d'Audit</Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Nom" name="demandeur_nom" value={formData.demandeur_nom} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Prénom" name="demandeur_prenom" value={formData.demandeur_prenom} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Email" type="email" name="demandeur_email" value={formData.demandeur_email} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Téléphone" name="demandeur_phone" value={formData.demandeur_phone} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Département" name="demandeur_departement" value={formData.demandeur_departement} onChange={handleChange} required />
        <TextField fullWidth margin="normal" label="Domain Name" name="domain_name" value={formData.domain_name} onChange={handleChange} required />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Type d'Audit</InputLabel>
          <Select name="type_audit" value={formData.type_audit} onChange={handleChange}>
            <MenuItem value="Pentest">Pentest</MenuItem>
            <MenuItem value="Audit_Archi">Audit Architecture</MenuItem>
            <MenuItem value="Audit_Net">Audit Réseau</MenuItem>
            <MenuItem value="Audit_Config">Audit Configuration</MenuItem>
            <MenuItem value="Audit_CS">Audit Code Source</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth margin="normal" label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={3} required />
        <TextField fullWidth margin="normal" label="Objectif" name="objectif" value={formData.objectif} onChange={handleChange} multiline rows={3} required />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Urgence</InputLabel>
          <Select name="urgence" value={formData.urgence} onChange={handleChange}>
            <MenuItem value="Faible">Faible</MenuItem>
            <MenuItem value="Moyenne">Moyenne</MenuItem>
            <MenuItem value="Haute">Haute</MenuItem>
          </Select>
        </FormControl>

        <Box mt={2}>
          <input type="file" name="fichier_attache" onChange={handleFileChange} />
        </Box>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Envoyer la demande"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AuditRequestForm;
