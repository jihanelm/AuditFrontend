// PlanServiceV2 + ajout des colonnes

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
} from "@mui/material";
import api from "../../api";
import EditPlanForm from "./EditPlanForm"

const PlanService = () => {
  const [file, setFile] = useState(null);
  const [plans, setPlans] = useState([]);
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    status: "",
    type_audit: "",
  });

  const [columns, setColumns] = useState([]); 

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
          "ref", "type_audit", "date_debut", "date_realisation",
          "duree", "date_fin", "status", "remarques"
        ];
  
        const extraKeys = Object.keys(response.data[0].extra_data || {});
        setColumns([...baseKeys, ...extraKeys]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des plans :", error);
    }
  };
  
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSetReminder = (plan) => {
    alert(`Un rappel a été défini pour le plan: ${plan.ref}`);
    // Ici, tu peux plus tard ajouter une vraie logique de rappel, calendrier, email, etc.
  };
  

  useEffect(() => {
    if (columns.length > 0) {
      const initialPlan = {};
      columns.forEach(col => {
        initialPlan[col] = "";
      });
      setNewPlan(initialPlan);
    }
  }, [columns]);
  

  const [audits, setAudits] = useState([]);
  const [selectedAuditId, setSelectedAuditId] = useState("");

  const fetchAudits = async () => {
    try {
      const response = await api.get("/audits/");
      setAudits(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des audits :", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchAudits();
  }, []);;  

  useEffect(() => {
    if (plans.length > 0) {
      const extraKeys = Object.keys(plans[0].extra_data || {});
      const newExtraFields = {};
      extraKeys.forEach(key => {
        newExtraFields[key] = "";
      });
      setNewPlan((prev) => ({
        ...prev,
        extra_data: newExtraFields
      }));
    }
  }, [plans]);  

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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier avant d'uploader.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post(`/plan/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Fichier uploadé avec succès !");
      fetchPlans();
    } catch (error) {
      console.error("Erreur lors de l'importation :", error.response?.data || error.message);
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

  const [newPlan, setNewPlan] = useState({
    ref: "",
    type_audit: "",
    date_debut: "",
    date_realisation: "",
    duree: "",
    date_fin: "",
    status: "",
    remarques: "",
  });

  const handleAddPlan = async () => {
    try {
      await api.post(`/plan/plan/`, newPlan);
      fetchPlans();
      setNewPlan({
        ref: "",
        type_audit: "",
        date_debut: "",
        date_realisation: "",
        duree: "",
        date_fin: "",
        status: "",
        remarques: "",
        audit_id: selectedAuditId ? parseInt(selectedAuditId) : null,
      });
      setShowNewRow(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout !");
    }
  };

  const [showNewRow, setShowNewRow] = useState(false);

  return (
    <Box sx={{ mt: 4, px: 2, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Plans
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Uploader un fichier Excel</Typography>
        <Box display="flex" alignItems="center">
          <Input type="file" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{ ml: 2 }}
          >
            Uploader
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Filtres</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Mois"
              fullWidth
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Année"
              fullWidth
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Statut"
              fullWidth
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Type d'Audit"
              fullWidth
              value={filters.type_audit}
              onChange={(e) => setFilters({ ...filters, type_audit: e.target.value })}
            />
          </Grid>
        </Grid>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={fetchPlans}>
            Appliquer les filtres
          </Button>
          <Button variant="contained" color="secondary" onClick={downloadPlans}>
            Télécharger
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Ajouter un audit</Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              value={selectedAuditId}
              onChange={(e) => handleAuditSelection(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="">-- Choisir un audit --</option>
              {audits.map((audit) => (
                <option key={audit.id} value={audit.id}>
                  [{audit.id}] {audit.type_audit}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {plans.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Aucun plan disponible. Veuillez uploader un fichier Excel.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4, width: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1500 }}>        
          <TableHead>
            <TableRow>
                <TableCell>Réf</TableCell>
                <TableCell>Type Audit</TableCell>
                <TableCell>Date Début</TableCell>
                <TableCell>Date de Réalisation</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Date Fin</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Remarques</TableCell>
                {plans.length > 0 && Object.keys(plans[0].extra_data || {}).map((key) => (
                <TableCell key={key}>{key}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.ref}</TableCell>
                  <TableCell>{plan.type_audit}</TableCell>
                  <TableCell>{plan.date_debut}</TableCell>
                  <TableCell>{plan.date_realisation || "-"}</TableCell>
                  <TableCell>{plan.duree}</TableCell>
                  <TableCell>{plan.date_fin}</TableCell>
                  <TableCell>{plan.status}</TableCell>
                  <TableCell>{plan.remarques}</TableCell>
                  {Object.entries(plan.extra_data || {}).map(([key, value]) => (
                    <TableCell key={key}>{value}</TableCell>
                   ))}
                   <TableCell>
                   {selectedPlan && (
                          <EditPlanForm
                            plan={selectedPlan}
                            open={Boolean(selectedPlan)}
                            onClose={() => setSelectedPlan(null)}
                            fetchPlans={fetchPlans}
                          />
                        )}

                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(plan)}
                        sx={{ mr: 1 }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleSetReminder(plan)}
                      >
                        Rappel
                      </Button>
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
                        onChange={(e) =>
                            setNewPlan((prev) => ({
                            ...prev,
                            [col]: e.target.value,
                            }))
                        }
                        />
                    </TableCell>
                    ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPlan}
                      size="small"
                    >
                      Enregistrer
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setShowNewRow(true)}
            >
              + Ajouter un Plan
            </Button>
          </Box>
        </TableContainer>
      )}
    </Box>
  );
};

export default PlanService;