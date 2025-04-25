import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormGroup,
} from "@mui/material";
import api from "../../api";

const AuditRequest = () => {
  const [formData, setFormData] = useState({
    type_audit: "",
    demandeur_nom_1: "",
    demandeur_prenom_1: "",
    demandeur_email_1: "",
    demandeur_phone_1: "",
    demandeur_entite_1: "",
    demandeur_nom_2: "",
    demandeur_prenom_2: "",
    demandeur_email_2: "",
    demandeur_phone_2: "",
    demandeur_entite_2: "",
    nom_app: "",
    description: "",
    liste_fonctionalites: "",
    type_app: [],
    type_app_2: [],
    architecture_projet: false,
    commentaires_archi: "",
    protection_waf: false,
    commentaires_waf: "",
    ports: false,
    liste_ports: "",
    cert_ssl_domain_name: false,
    commentaires_cert_ssl_domain_name: "",
    sys_exploitation: "",
    logiciels_installes: "",
    env_tests: [],
    donnees_prod: false,
    liste_si_actifs: "",
    compte_admin: "",
    nom_domaine: "",
    url_app: "",
    compte_test_profile: "",
    urgence: "",
    fichiers_attaches: []
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [appContext, setAppContext] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({
      ...prev,
      fichiers_attaches: Array.from(e.target.files)
      }));
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    try {
      const dataToSend = new FormData();
  
      for (const [key, value] of Object.entries(formData)) {
        if (key === "fichiers_attaches" || key === "files") {
          value.forEach((file) => {
            dataToSend.append("files", file);
          });
        } else {
          dataToSend.append(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }
  
      await api.post("/audits/request", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      setSuccessMessage("Demande envoyée avec succès !");
    } catch (error) {
      console.error("Error sending data:", error.response?.data || error.message);
      setErrorMessage("Erreur lors de l'envoi de la demande.");
    }
  
    setLoading(false);
  };
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Formulaire de Demande d'Audit
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* 1. Identification du demandeur */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="1. Identification du demandeur" />
          <CardContent>
            <Typography variant="h6">Contact Principal</Typography>
            {["nom_1", "prenom_1", "email_1", "phone_1", "entite_1"].map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="normal"
                label={field.replace(/_/g, " ").replace("1", "")}
                name={`demandeur_${field}`}
                value={formData[`demandeur_${field}`]}
                onChange={handleChange}
                required
              />
            ))}
            <Typography variant="h6">Contact Secondaire</Typography>
            {["nom_2", "prenom_2", "email_2", "phone_2", "entite_2"].map((field) => (
              <TextField
                key={field}
                fullWidth
                margin="normal"
                label={field.replace(/_/g, " ").replace("2", "")}
                name={`demandeur_${field}`}
                value={formData[`demandeur_${field}`]}
                onChange={handleChange}
              />
            ))}
          </CardContent>
        </Card>

        {/* 2. Application ou Solution à tester */}
        <Card variant="outlined" sx={{ mb: 3 }}>
        <CardHeader title="2. Application ou Solution à tester" />
        <CardContent>
            {["nom_app", "description", "liste_fonctionalites"].map((field) => (
            <TextField
                key={field}
                fullWidth
                margin="normal"
                label={field.replace(/_/g, " ").toUpperCase()}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                multiline
                rows={3}
                required
            />
            ))}

            <FormControl fullWidth margin="normal">
            <InputLabel>Type d'application</InputLabel>
            <Select
                name="type_app"
                value={formData.type_app}
                onChange={(e) => {
                handleMultiSelectChange("type_app", e.target.value);
                if (e.target.value.length === 1) {
                    setAppContext(e.target.value[0]);
                } else {
                    setAppContext("");
                }
                }}
                multiple
            >
                {['Web', 'Mobile', 'Client Lourd'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
            </Select>
            </FormControl>

            {formData.type_app.length === 1 && (
            <FormControl fullWidth margin="normal">
                <InputLabel>Contexte d'accès</InputLabel>
                <Select
                name="type_app_2"
                value={formData.type_app_2}
                onChange={(e) => {
                handleMultiSelectChange("type_app_2", e.target.value);
                if (e.target.value.length === 1) {
                    setAppContext(e.target.value[0]);
                } else {
                    setAppContext("");
                }
                }}
                multiple
            >
                {['Externe', 'Interne'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
            </Select>
            </FormControl>
            )}
        </CardContent>
        </Card>

        {/* 3. Exigences techniques */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="3. Exigences techniques" />
          <CardContent>
            <Typography variant="subtitle1">Architecture du projet</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={formData.architecture_projet} onChange={handleChange} name="architecture_projet" />}
                label="Existe (Fournir une version à jour)"
              />
              <FormControlLabel
                control={<Checkbox checked={!formData.architecture_projet} onChange={() => setFormData(prev => ({ ...prev, architecture_projet: !prev.architecture_projet }))} />}
                label="Inexistante"
              />
            </FormGroup>
            <TextField
              fullWidth
              margin="normal"
              label="Commentaires"
              name="commentaires_archi"
              value={formData.commentaires_archi}
              onChange={handleChange}
            />

            <Typography variant="subtitle1">Protection via un Web Application Firewall (WAF)</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={formData.protection_waf} onChange={handleChange} name="protection_waf" />}
                label="Oui"
              />
              <FormControlLabel
                control={<Checkbox checked={!formData.protection_waf} onChange={() => setFormData(prev => ({ ...prev, protection_waf: !prev.protection_waf }))} />}
                label="Non"
              />
            </FormGroup>
            <TextField
              fullWidth
              margin="normal"
              label="Commentaires"
              name="commentaires_waf"
              value={formData.commentaires_waf}
              onChange={handleChange}
            />

            <Typography variant="subtitle1">Les ports & services sont-ils sécurisés ?</Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={formData.ports} onChange={handleChange} name="ports" />}
                label="Oui"
              />
              <FormControlLabel
                control={<Checkbox checked={!formData.ports} onChange={() => setFormData(prev => ({ ...prev, ports: !prev.ports }))} />}
                label="Non"
              />
            </FormGroup>
            <TextField fullWidth margin="normal" label="Liste des ports" name="liste_ports" value={formData.liste_ports} onChange={handleChange} />

            <Typography variant="subtitle1">Certificat SSL & Nom de domaine</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={formData.cert_ssl_domain_name} onChange={handleChange} name="cert_ssl_domain_name" />} label="Oui" />
              <FormControlLabel control={<Checkbox checked={!formData.cert_ssl_domain_name} onChange={() => setFormData(prev => ({ ...prev, cert_ssl_domain_name: !prev.cert_ssl_domain_name }))} />} label="Non" />
            </FormGroup>
            <TextField fullWidth margin="normal" label="Commentaires" name="commentaires_cert_ssl_domain_name" value={formData.commentaires_cert_ssl_domain_name} onChange={handleChange} />
          </CardContent>
        </Card>

        {/* 4. Prérequis techniques */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="4. Prérequis techniques" />
          <CardContent>
            {[
              ["sys_exploitation", "Système d'exploitation"],
              ["logiciels_installes", "Logiciels installés"],
              ["liste_si_actifs", "Liste des actifs"],
              ["compte_admin", "Compte Admin"],
              ["nom_domaine", "Nom de domaine"],
              ["url_app", "URL de l'application"],
              ["compte_test_profile", "Comptes de test par profil"]
            ].map(([name, label]) => (
              <TextField
                key={name}
                fullWidth
                margin="normal"
                label={label}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            ))}
            <FormControl fullWidth margin="normal">
              <InputLabel>Environnement de test</InputLabel>
              <Select
                multiple
                name="env_tests"
                value={formData.env_tests}
                onChange={(e) => handleMultiSelectChange("env_tests", e.target.value)}
              >
                {['Développement', 'Recette/UAT', 'Pré-production', 'Production'].map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={formData.donnees_prod} onChange={handleChange} name="donnees_prod" />}
              label="L'environnement de test contient des données de production"
            />
          </CardContent>
        </Card>

        {/* 5. Urgence & Fichiers */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardHeader title="5. Urgence & Fichiers" />
          <CardContent>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Urgence</InputLabel>
              <Select name="urgence" value={formData.urgence} onChange={handleChange}>
                <MenuItem value="Faible">Faible</MenuItem>
                <MenuItem value="Moyenne">Moyenne</MenuItem>
                <MenuItem value="Haute">Haute</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <InputLabel>Fichiers Attachés</InputLabel>
              <input
                type="file"
                multiple
                name="fichiers_attaches"
                onChange={handleFileChange}
              />
            </Box>
          </CardContent>
        </Card>

        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Envoyer la demande"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AuditRequest;
