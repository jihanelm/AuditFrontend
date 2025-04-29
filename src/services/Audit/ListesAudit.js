import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
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
      const auditsData = response.data.map((audit) => ({
        id: audit.id,
        total_duration: audit.total_duration,
        etat: audit.etat,
        demande_audit: {
          nom_app: audit.demande_audit?.nom_app || "",
          demandeur_nom_1: audit.demande_audit?.demandeur_nom_1 || "",
          demandeur_prenom_1: audit.demande_audit?.demandeur_prenom_1 || "",
          demandeur_email_1: audit.demande_audit?.demandeur_email_1 || "",
          demandeur_phone_1: audit.demande_audit?.demandeur_phone_1 || "",
          fichiers_attaches: audit.demande_audit?.fichiers_attaches || [],
        },
        prestataire: {
          nom: audit.prestataire?.nom || "",
        },
        auditeurs: audit.auditeurs?.map((a) => ({
          nom: a.nom || "",
          prenom: a.prenom || "",
          email: a.email || "",
          phone: a.phone || "",
        })) || [],
        duration: formatDuration(audit.total_duration, audit.etat),
      }));
      setAudits(auditsData);
    } catch (error) {
      console.error("Erreur fetchAuditDetails :", error);
    }
  };

  const formatDuration = (durationInDays, etat) => {
    if (!etat) return "N/A";
    if (etat.toLowerCase() === "suspendu") return "⏸️ Suspendu";
    if (etat.toLowerCase() === "terminé") return `${Math.floor(durationInDays)} jour(s)`;
    if (etat.toLowerCase() === "en cours") return `${durationInDays.toFixed(2)} jour(s)`;
    return "N/A";
  };

  const handleOpenPDF = (row) => {
    const fichiers = row.demande_audit?.fichiers_attaches || [];
    const pdfFiles = fichiers.filter((file) => file.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) return alert("Aucun PDF disponible.");
    if (pdfFiles.length === 1) {
      const url = `http://localhost:8000/${pdfFiles[0].replace(/\\/g, "/")}`;
      window.open(url, "_blank");
      return;
    }

    const choix = prompt(
      "Choisissez le numéro du fichier PDF à ouvrir :\n" +
        pdfFiles.map((file, index) => `${index + 1}. ${file}`).join("\n")
    );

    const indexChoisi = parseInt(choix, 10) - 1;
    if (indexChoisi >= 0 && indexChoisi < pdfFiles.length) {
      const url = `http://localhost:8000/${pdfFiles[indexChoisi].replace(/\\/g, "/")}`;
      window.open(url, "_blank");
    } else {
      alert("Choix invalide.");
    }
  };

  return (
    <Box
      sx={{
        height: "100%", // Adjust depending on your navbar/footer
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Liste des Audits
      </Typography>
      <TableContainer component={Paper}>
        <Table padding="normal">
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>Application</TableCell>
              <TableCell colSpan={3} align="center" sx={{ px: 3, py: 2 }}>Demandeur</TableCell>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>Prestataire</TableCell>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>Auditeur Externe</TableCell>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>Durée</TableCell>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>État</TableCell>
              <TableCell rowSpan={2} sx={{ px: 3, py: 2 }}>Actions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ px: 3, py: 2 }}>Nom et Prénom</TableCell>
              <TableCell sx={{ px: 3, py: 2 }}>Email</TableCell>
              <TableCell sx={{ px: 3, py: 2 }}>Téléphone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {audits.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.demande_audit.nom_app}</TableCell>
                <TableCell>
                  {row.demande_audit.demandeur_nom_1} {row.demande_audit.demandeur_prenom_1}
                </TableCell>
                <TableCell>{row.demande_audit.demandeur_email_1}</TableCell>
                <TableCell>{row.demande_audit.demandeur_phone_1}</TableCell>
                <TableCell>{row.prestataire.nom || "N/A"}</TableCell>
                <TableCell>
                  {row.auditeurs[0]
                    ? `${row.auditeurs[0].nom} ${row.auditeurs[0].prenom}`
                    : "N/A"}
                </TableCell>
                <TableCell>{row.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={row.etat || "N/A"}
                    color={
                      row.etat?.toLowerCase() === "suspendu"
                        ? "warning"
                        : row.etat?.toLowerCase() === "terminé"
                        ? "default"
                        : "success"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => console.log("Modifier", row.id)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() => console.log("Arrêter", row.id)}
                  >
                    Arrêter
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenPDF(row)}
                    endIcon={<OpenInNewIcon />}
                  >
                    Voir PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
