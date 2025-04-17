// PlanServiceV2 + ajout des colonnes

import React, { useState, useEffect } from "react";
import {
  Container,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../api";

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

  const fetchColumns = async () => {
    try {
      const response = await api.get("/admin/plan/columns");
      const allColumns = response.data;
      const excluded = ["id", "created_at", "updated_at"];
  
      const filteredColumns = allColumns.filter(
        col => !excluded.includes(col.name)
      );
  
      setColumns(filteredColumns);
    } catch (error) {
      console.error("Erreur lors du chargement des colonnes :", error);
    }
  };
  

useEffect(() => {
  fetchColumns();
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
    } catch (error) {
      console.error("Erreur lors du chargement des plans :", error);
    }
  };

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
    if (columns.length > 0) {
      const initialPlan = {};
      columns.forEach(col => initialPlan[col.name] = "");
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

  const mysqlTypes = [
    "VARCHAR(255)",
    "INT",
    "TEXT",
    "DATE",
    "DATETIME",
    "BOOLEAN",
    "DECIMAL(10,2)",
    "FLOAT",
    "DOUBLE",
    "CHAR(10)",
  ];

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
  const [newColumn, setNewColumn] = useState({
    name: "",
    type: "VARCHAR(255)",
  });
  
  const handleAddColumn = async () => {
    if (!newColumn.name) {
      alert("Le nom de la colonne est requis.");
      return;
    }
  
    try {
      await api.post("/admin/plan/add-column", {
        column_name: newColumn.name,
        column_type: newColumn.type || "VARCHAR(255)",
      });
      alert(`Colonne '${newColumn.name}' ajoutée avec succès !`);
      setNewColumn({ name: "", type: "VARCHAR(255)" });
      fetchPlans(); // recharger les données si besoin
    } catch (error) {
      console.error("Erreur lors de l'ajout de la colonne :", error);
      alert("Erreur lors de l'ajout de la colonne !");
    }
  };
  

  return (
    <Container sx={{ mt: 4 }}>
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
        <Typography variant="h6">Ajouter une colonne</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Nom de la colonne"
              fullWidth
              value={newColumn.name}
              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Type SQL</InputLabel>
              <Select
                value={newColumn.type}
                onChange={(e) =>
                  setNewColumn({ ...newColumn, type: e.target.value })
                }
                label="Type SQL"
              >
                {mysqlTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <Button variant="contained" color="success" onClick={handleAddColumn}>
              Ajouter la colonne
            </Button>
          </Grid>
        </Grid>
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
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          {columns.length === 0 ? (
  <Typography>Aucune colonne à afficher</Typography>
) : (
<Table>
          <TableHead>
            <TableRow>
                {columns.map((col) => (
                <TableCell key={col.name}>{col.name}</TableCell>
                ))}
            </TableRow>
            </TableHead>

            <TableBody>
            {plans.map((plan) => (
    <TableRow key={plan.id}>
      {columns.map((col) => (
        <TableCell key={col.name}>
          {plan[col.name] ?? "-"}
        </TableCell>
      ))}
    </TableRow>
  ))}
  {showNewRow && (
    <TableRow>
      {columns.map((col) => (
        <TableCell key={col.name}>
          <Input
            fullWidth
            value={newPlan[col.name] || ""}
            placeholder={col.name}
            onChange={(e) => setNewPlan({
              ...newPlan,
              [col.name]: e.target.value
            })}
          />
        </TableCell>
      ))}
      <TableCell>
        <Button variant="contained" onClick={handleAddPlan}>
          Enregistrer
        </Button>
      </TableCell>
    </TableRow>
  )}
            </TableBody>

          </Table>
)}
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
    </Container>
  );
};

export default PlanService;