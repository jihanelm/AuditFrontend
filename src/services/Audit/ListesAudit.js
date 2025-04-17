import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../api";

export default function ListesAudit() {
  const [setAuditeurs] = useState([]);
  const [setPrestataires] = useState([]);
  const [audits, setAudits] = useState([]);
  const [setEditingAuditeur] = useState(null);

  useEffect(() => {
    fetchAuditeurs();
    fetchPrestataires();
    fetchAuditDetails();
  }, []);

  const fetchAuditeurs = async () => {
    try {
      const response = await api.get("/affect/auditeurs/");
      setAuditeurs(response.data);
    } catch (error) {
      console.error("Erreur fetchAuditeurs :", error);
    }
  };
  
  const fetchPrestataires = async () => {
    try {
      const response = await api.get("/affect/prestataires/");
      setPrestataires(response.data);
    } catch (error) {
      console.error("Erreur fetchPrestataires :", error);
    }
  }; 
  
  const fetchAuditDetails = async () => {
    try {
      const response = await api.get("/audits/");
      setAudits(response.data);
    } catch (error) {
      console.error("Erreur fetchAuditDetails :", error);
    }
  };  

  const columns = [
    {
      field: "check",
      headerName: "",
      width: 70,
      renderCell: () => <input type="checkbox" />,
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "application", headerName: "Application/Solution", flex: 1 },
    { field: "type_app", headerName: "Type d'Application", flex: 1 },
    { field: "type_audit", headerName: "Type d'Audit", flex: 1 },
    { field: "date_realisation", headerName: "Date de Réalisation", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Button >Ajouter au Plan</Button>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Liste des Audits</Typography>

      <Box mb={2} width={300}>
        
      </Box>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={audits}
          columns={columns}
          pageSize={7}
          getRowId={(row) => row.id}
        />
      </div>
    </Box>
  );
}
