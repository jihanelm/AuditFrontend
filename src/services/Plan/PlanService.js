import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../../api";
import EditPlanForm from "./EditPlanForm";
import parse from 'html-react-parser';

const PlanService = () => {
  const [file, setFile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    date_realisation: "",
    date_cloture: "",
    date_rapport: "",
    type_audit: "",
  });

  const [columns, setColumns] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [audits, setAudits] = useState([]);
  const [selectedAuditId, setSelectedAuditId] = useState("");
  const [newPlan, setNewPlan] = useState({
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
  });
  const [showNewRow, setShowNewRow] = useState(false);
  const [selectedVulns, setSelectedVulns] = useState([]);
  const [vulnDialogOpen, setVulnDialogOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchAudits();
  }, []);

  const fetchPlans = async () => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await api.get(`/plan/plans/`, {
        params: filteredParams,
      });
      setPlans(response.data);

      if (response.data.length > 0) {
        const baseKeys = [
          "ref", "application", "type_audit", "date_realisation", "date_cloture", "date_rapport",
          "niveau_securite", "nb_vulnerabilites", "taux_remediation", "commentaire_dcsg", "commentaire_cp"
        ];
        const extraKeys = Object.keys(response.data[0].extra_data || {});
        setColumns([...baseKeys, ...extraKeys]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des plans :", error);
    }
  };

  const fetchAudits = async () => {
    try {
      const response = await api.get("/audits");
      setAudits(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des audits :", error);
    }
  };

  useEffect(() => {
    if (columns.length > 0) {
      const initialPlan = {};
      columns.forEach(col => initialPlan[col] = "");
      setNewPlan(initialPlan);
    }
  }, [columns]);

  const handleAuditSelection = (auditId) => {
    const selectedAudit = audits.find((a) => a.id === parseInt(auditId));
    setSelectedAuditId(auditId);
    if (selectedAudit) {
      setNewPlan((prev) => ({
        ...prev,
        type_audit: selectedAudit.type_audit,
        remarques: `${selectedAudit.objectif} - ${selectedAudit.description}`
      }));
      setShowNewRow(true);
    }
  };

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier avant d'uploader.");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post(`/plan/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Fichier uploadé avec succès !");
      fetchPlans();
    } catch (error) {
      console.error("Erreur lors de l'importation :", error);
      alert("Erreur lors de l'importation !");
    }
  };

  const downloadPlans = async () => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const response = await api.get(`/plan/plans/download/`, {
        params: filteredParams,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plans.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  const handleAddPlan = async () => {
    try {
      await api.post(`/plan/plan/`, newPlan);
      fetchPlans();
      setNewPlan({});
      setShowNewRow(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout !");
    }
  };

  const handleEditClick = (plan) => setSelectedPlan(plan);

  const handleSetReminder = (plan) => alert(`Un rappel a été défini pour le plan: ${plan.ref}`);

  const handleShowVulns = (vulns) => {
    setSelectedVulns(vulns || []);
    setVulnDialogOpen(true);
  };

  return (
    <Box sx={{ mt: 4, px: 2, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Gestion des Plans</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Uploader un fichier Excel</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Input type="file" onChange={handleFileChange} />
          <Button variant="contained" onClick={handleUpload}>Uploader</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Filtres</Typography>
        <Grid container spacing={2}>
          {Object.keys(filters).map((key) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <TextField
                label={key.replace(/_/g, ' ')}
                fullWidth
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={2} display="flex" gap={2}>
          <Button variant="contained" onClick={fetchPlans}>Appliquer les filtres</Button>
          <Button variant="outlined" onClick={downloadPlans}>Télécharger</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Ajouter un audit</Typography>
        <FormControl fullWidth>
          <InputLabel>Choisir un audit</InputLabel>
          <Select value={selectedAuditId} onChange={(e) => handleAuditSelection(e.target.value)}>
            <MenuItem value=""><em>None</em></MenuItem>
            {audits.map((audit) => (
              <MenuItem key={audit.id} value={audit.id}>
                [{audit.id}] {audit.type_audit}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {plans.length === 0 ? (
        <Typography>Aucun plan disponible.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col}>{col.replace(/_/g, ' ')}</TableCell>
                ))}
                <TableCell>Vulnérabilités</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {col === "commentaire_dcsg" || col === "commentaire_cp"
                        ? parse(plan[col] || "")
                        : plan[col]}
                    </TableCell>
                  ))}

                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleShowVulns(plan.vulnerabilites)}>
                      Voir
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" onClick={() => handleEditClick(plan)} sx={{ mr: 1 }}>
                      Modifier
                    </Button>
                    <Button variant="outlined" size="small" color="secondary" onClick={() => handleSetReminder(plan)}>
                      Rappel
                    </Button>
                    {selectedPlan && selectedPlan.id === plan.id && (
                      <EditPlanForm
                        plan={selectedPlan}
                        open={Boolean(selectedPlan)}
                        onClose={() => setSelectedPlan(null)}
                        fetchPlans={fetchPlans}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {showNewRow && (
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      <Input
                        fullWidth
                        placeholder={col.replace("_", " ")}
                        value={newPlan[col] || ""}
                        onChange={(e) => setNewPlan({ ...newPlan, [col]: e.target.value })}
                      />
                    </TableCell>
                  ))}
                  <TableCell colSpan={2}>
                    <Button variant="contained" size="small" onClick={handleAddPlan}>Enregistrer</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button variant="contained" color="success" onClick={() => setShowNewRow(true)}>
              + Ajouter un Plan
            </Button>
          </Box>
        </TableContainer>
      )}

      <Dialog open={vulnDialogOpen} onClose={() => setVulnDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Vulnérabilités du plan</DialogTitle>
        <DialogContent>
          {selectedVulns.length === 0 ? (
            <Typography>Aucune vulnérabilité enregistrée.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Titre</TableCell>
                  <TableCell>Criticité</TableCell>
                  <TableCell>Remédiation %</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedVulns.map((vuln, index) => (
                  <TableRow key={index}>
                    <TableCell>{vuln.titre}</TableCell>
                    <TableCell>{vuln.criticite}</TableCell>
                    <TableCell>{vuln.pourcentage_remediation}</TableCell>
                    <TableCell>{vuln.statut_remediation}</TableCell>
                    <TableCell>{vuln.actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVulnDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanService;
