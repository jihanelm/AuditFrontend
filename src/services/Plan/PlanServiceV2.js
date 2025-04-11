// PlanServiceV1 + ajout des ligne

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

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

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
      await api.post(`/plan/plans/`, newPlan);
      fetchPlans();
      setNewPlan({ /* reset fields */ });
      setShowNewRow(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Erreur lors de l'ajout !");
    }
  };  

  const [showNewRow, setShowNewRow] = useState(false);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Plans
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Uploader un fichier Excel</Typography>
        <Input type="file" onChange={handleFileChange} />
        <Button
          variant="contained"
          color="primary"
          onClick={(handleUpload)} 
          sx={{ ml: 2 }}
        >
          Uploader
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Filtres</Typography>
        <TextField
          label="Mois"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Année"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Statut"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Type d'Audit"
          value={filters.type_audit}
          onChange={(e) =>
            setFilters({ ...filters, type_audit: e.target.value })
          }
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={fetchPlans} sx={{ mt: 2 }}>
          Appliquer les filtres
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={downloadPlans}
          sx={{ mt: 2, ml: 2 }}
        >
          Télécharger
        </Button>
      </Paper>

      {plans.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Aucun plan disponible. Veuillez uploader un fichier Excel.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setShowNewRow(true)}
            sx={{ mb: 2 }}
           >
            + Ajouter un Plan
            </Button>
            {showNewRow && (
                <TableRow>
                    {Object.entries(newPlan).map(([key, value]) => (
                    <TableCell key={key}>
                        <Input
                        fullWidth
                        value={value}
                        onChange={(e) =>
                            setNewPlan({ ...newPlan, [key]: e.target.value })
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


        </TableContainer>
      )}
      </Container>
  );
};

export default PlanService;