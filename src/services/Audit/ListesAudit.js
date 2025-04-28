import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import api from "../../api";

export default function ListesAudit() {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetchAuditDetails();
  }, []);
  
  const fetchAuditDetails = async () => {
    try {
      const response = await api.get("/audit/audits/");
      console.log("DEBUG one audit: ", response.data[0]);
      setAudits(
        response.data.map((audit) => ({
          ...audit,
          duration: calculateDuration(audit.date_creation, audit.etat),
        }))
      );
    } catch (error) {
      console.error("Erreur fetchAuditDetails :", error);
    }
  };  

  const calculateDuration = (startTime, etat) => {
    if (!startTime || etat === "suspendu") return "⏸️ Suspendu";

    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.floor((now - start) / 1000); // in seconds

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleOpenPDF = (row) => {
    const path = row.demande_audit?.fiche_demande_path;
    if (path) {
      const url = `http://localhost:8000/${path.replace(/\\/g, "/")}`;
      window.open(url, "_blank");
    } else {
      alert("Aucun PDF disponible.");
    }
  };

  const columns = [
    {
      field: "application",
      headerName: "Application",
      flex: 1,
      valueGetter: (params) => params?.row?.demande_audit.nom_app || "N/A",
    },    
    {
      field: "demandeur",
      headerName: "Demandeur",
      flex: 1.5,
      valueGetter: (params) => {
        const row = params?.row;
        if (!row) return "N/A";
        return `${row.demandeur_nom_1} ${row.demandeur_prenom_1} (${row.demandeur_email_1}, ${row.demandeur_phone_1})`;
      },
    },
    {
      field: "prestataire",
      headerName: "Prestataire",
      flex: 1,
      valueGetter: (params) => params?.row?.prestataire?.nom || "N/A",
    },
    {
      field: "auditeur_externe",
      headerName: "Auditeur Externe",
      flex: 1.5,
      valueGetter: (params) => {
        const auditeurs = params?.row?.auditeurs;
        if (!auditeurs || auditeurs.length === 0) return "N/A";
        return auditeurs
          .map((a) => `${a.nom} ${a.prenom} (${a.email})`)
          .join(", ");
      },
    },    
    {
      field: "duration",
      headerName: "Durée",
      flex: 1,
    },
    {
      field: "etat",
      headerName: "État",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value || "N/A"}
          color={params.value === "suspendu" ? "warning" : "success"}
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => handleOpenPDF(params.row)}
          endIcon={<OpenInNewIcon />}
        >
          Voir PDF
        </Button>
      ),
    },
  ];  

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Liste des Audits
      </Typography>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={audits}
          columns={columns}
          pageSize={10}
          getRowId={(row) => row.id}
        />
      </div>
    </Box>
  );
}
