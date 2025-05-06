import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
  Container, Typography, Tabs, Tab, Box,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, TextField, Button, Grid, IconButton, Collapse
} from '@mui/material';
import { Add, Delete, ExpandLess, ExpandMore } from '@mui/icons-material';

export default function PlanManager() {
  const [tabIndex, setTabIndex] = useState(0);
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({ year: '', month: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [openRows, setOpenRows] = useState({});

  const [form, setForm] = useState({
    application: '',
    type_application: '',
    type_audit: '',
    date_realisation: '',
    date_cloture: '',
    date_rapport: '',
    niveau_securite: '',
    nb_vulnerabilites: '',
    taux_remediation: '',
    commentaire_dcsg: '',
    commentaire_cp: '',
    vulnerabilites: [
      {
        criticite: '',
        titre: '',
        actions: '',
        pourcentage_remediation: '',
        statut_remediation: ''
      }
    ]
  });

  const fetchPlans = async () => {
    try {
      const res = await api.get('/plan/plans', { params: filters });
      setPlans(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!file.name.endsWith('.xlsx')) {
      setMessage('Seuls les fichiers .xlsx sont autorisés');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/plan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Fichier importé avec succès');
      fetchPlans();
      setTabIndex(1);
    } catch (error) {
      console.error("Erreur d'importation:", error);
      setMessage("Erreur d'importation");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVulnerabilityChange = (index, field, value) => {
    const updated = [...form.vulnerabilites];
    updated[index][field] = value;
    setForm({ ...form, vulnerabilites: updated });
  };

  const addVulnerability = () => {
    setForm({
      ...form,
      vulnerabilites: [...form.vulnerabilites, {
        criticite: '',
        titre: '',
        actions: '',
        pourcentage_remediation: '',
        statut_remediation: ''
      }]
    });
  };

  const removeVulnerability = (index) => {
    const updated = [...form.vulnerabilites];
    updated.splice(index, 1);
    setForm({ ...form, vulnerabilites: updated });
  };

  const handleFormSubmit = async () => {
    try {
      await api.post('/plan/plan/', form);
      alert('Plan créé');
      fetchPlans();
      setTabIndex(1);
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      alert("Erreur lors de la création du plan");
    }
  };

  const downloadPlans = async () => {
    try {
      const response = await api.get('/plan/plans/download/', {
        params: filters,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'plans.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const toggleRow = (id) => {
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestion des Plans d'Audit</Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Uploader Plan" />
        <Tab label="Visualiser Plans" />
        <Tab label="Créer Plan" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Upload d'un plan (Excel)</Typography>
          <input type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>
            Uploader
          </Button>
          <Typography sx={{ mt: 1 }}>{message}</Typography>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Liste des plans</Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField name="year" label="Année" value={filters.year} onChange={handleFilterChange} />
            <TextField name="month" label="Mois" value={filters.month} onChange={handleFilterChange} />
            <Button variant="contained" onClick={fetchPlans}>Filtrer</Button>
          </Box>

          <Box>
            {plans.map((plan) => (
              <Box key={plan.id} sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    <strong>{plan.application}</strong> — {plan.type_application} — {plan.type_audit}
                  </Typography>
                  <IconButton onClick={() => toggleRow(plan.id)}>
                    {openRows[plan.id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Réalisation: {plan.date_realisation} | Clôture: {plan.date_cloture} | Rapport: {plan.date_rapport}
                </Typography>
                <Typography variant="body2">
                  Niveau: {plan.niveau_securite} | Vulnérabilités: {plan.nb_vulnerabilites} | Remédiation: {plan.taux_remediation}
                </Typography>
                <Typography variant="body2">
                  Commentaires DCSG: {plan.commentaire_dcsg} — CP: {plan.commentaire_cp}
                </Typography>

                <Collapse in={openRows[plan.id]} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Vulnérabilités</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Criticité</TableCell>
                          <TableCell>Titre</TableCell>
                          <TableCell>Actions</TableCell>
                          <TableCell>% Remédiation</TableCell>
                          <TableCell>Statut</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(plan.vulnerabilites || []).map((v, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{v.criticite}</TableCell>
                            <TableCell>{v.titre}</TableCell>
                            <TableCell>{v.actions}</TableCell>
                            <TableCell>{v.pourcentage_remediation}</TableCell>
                            <TableCell>{v.statut_remediation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>

          <Button variant="contained" onClick={downloadPlans} sx={{ mt: 2 }}>
            Télécharger Excel
          </Button>
        </Paper>
      )}

      {tabIndex === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Créer un Plan</Typography>
          <Grid container spacing={2}>
            {[
              { name: 'application', label: "Nom de l'application" },
              { name: 'type_application', label: "Type d'application" },
              { name: 'type_audit', label: "Type d'audit" },
              { name: 'date_realisation', label: 'Date de réalisation', type: 'date' },
              { name: 'date_cloture', label: 'Date de clôture', type: 'date' },
              { name: 'date_rapport', label: 'Date du rapport', type: 'date' },
              { name: 'niveau_securite', label: 'Niveau de sécurité' },
              { name: 'nb_vulnerabilites', label: 'Nombre de vulnérabilités' },
              { name: 'taux_remediation', label: 'Taux de remédiation' },
              { name: 'commentaire_dcsg', label: 'Commentaire DCSG' },
              { name: 'commentaire_cp', label: 'Commentaire CP' },
            ].map(({ name, label, type = 'text' }) => (
              <Grid item xs={12} sm={6} key={name}>
                <TextField
                  fullWidth
                  name={name}
                  label={label}
                  type={type}
                  InputLabelProps={type === 'date' ? { shrink: true } : {}}
                  value={form[name]}
                  onChange={handleFormChange}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={3}>
            <Typography variant="subtitle1">Vulnérabilités</Typography>
            {form.vulnerabilites.map((vuln, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                {['criticite', 'titre', 'actions', 'pourcentage_remediation', 'statut_remediation'].map((field) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                      fullWidth
                      label={field.replace(/_/g, ' ')}
                      value={vuln[field]}
                      onChange={(e) =>
                        handleVulnerabilityChange(index, field, e.target.value)
                      }
                    />
                  </Grid>
                ))}
                <Grid item>
                  <IconButton onClick={() => removeVulnerability(index)} disabled={form.vulnerabilites.length === 1}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addVulnerability}
              sx={{ mt: 2 }}
            >
              Ajouter une vulnérabilité
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleFormSubmit}
            sx={{ mt: 3 }}
          >
            Enregistrer
          </Button>
        </Paper>
      )}
    </Container>
  );
}
