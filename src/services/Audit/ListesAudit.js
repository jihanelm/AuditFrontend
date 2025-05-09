import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  TableSortLabel,
  Button,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../../api";

export default function ListesAudit() {
  const [audits, setAudits] = useState([]);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("nom_app");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const handleChangeEtat = async (id, newEtat) => {
    try {
      await api.patch(`/audit/audits/${id}/etat`, { new_etat: newEtat });
      fetchAuditDetails();
    } catch (error) {
      console.error(`Erreur lors du changement d'état (${newEtat}) :`, error);
      alert(`Échec du changement d'état vers "${newEtat}"`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      audits.forEach((audit) => {
        if (audit.etat === "En cours") {
          api.get(`/audit/audits/${audit.id}/duration`).then((res) => {
            setAudits((prev) =>
              prev.map((a) =>
                a.id === audit.id ? { ...a, duration: `${res.data.duration} jour(s)` } : a
              )
            );
          });
        }
      });
    }, 60000); // 60s
  
    return () => clearInterval(interval);
  }, [audits]);  

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
          fiche_demande_path: audit.demande_audit?.fiche_demande_path || "",
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
    const fichiers = row.demande_audit?.fiche_demande_path || [];
    const pdfFiles = fichiers.filter((file) => file.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) return alert("Aucune Fiche disponible.");
    if (pdfFiles.length === 1) {
      const url = `http://localhost:8000/${pdfFiles.replace(/\\/g, "/")}`;
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortComparator = (a, b, orderBy) => {
    const valA = a.demande_audit[orderBy]?.toLowerCase?.() || "";
    const valB = b.demande_audit[orderBy]?.toLowerCase?.() || "";
    return valA.localeCompare(valB);
  };

  const sortedAudits = [...audits]
    .filter((audit) =>
      audit.demande_audit.nom_app.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      order === "asc"
        ? sortComparator(a, b, orderBy)
        : sortComparator(b, a, orderBy)
    );

  const paginatedAudits = sortedAudits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Liste des Audits</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Rechercher une application"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Tooltip title="Rafraîchir">
            <IconButton onClick={fetchAuditDetails} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "nom_app" ? order : false}>
                <TableSortLabel
                  active={orderBy === "nom_app"}
                  direction={orderBy === "nom_app" ? order : "asc"}
                  onClick={() => handleRequestSort("nom_app")}
                >
                  Application
                </TableSortLabel>
              </TableCell>
              <TableCell colSpan={3} align="center">Demandeur</TableCell>
              <TableCell>Prestataire</TableCell>
              <TableCell>Auditeur Externe</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>État</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Nom et Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAudits.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.demande_audit.nom_app}</TableCell>
                <TableCell>{`${row.demande_audit.demandeur_nom_1} ${row.demande_audit.demandeur_prenom_1}`}</TableCell>
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
                        ? "error"
                        : "success"
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    sx={{ mr: 1 }}
                    onClick={() => handleChangeEtat(row.id, "Suspendu")}
                  >
                    Suspendre
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => handleChangeEtat(row.id, "En Cours")}
                  >
                    Continuer
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    sx={{ mr: 1 }}
                    onClick={() => handleChangeEtat(row.id, "Terminé")}
                  >
                    Terminer
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={sortedAudits.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}
