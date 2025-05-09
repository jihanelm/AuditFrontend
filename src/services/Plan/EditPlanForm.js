import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Divider,
  Paper,
  Grid,
  Box,
  MenuItem,
} from "@mui/material";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 as uuidv4 } from 'uuid';
import api from "../../api";

const EditPlanForm = ({ plan, open, onClose, fetchPlans }) => {
  const [formData, setFormData] = useState({
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
    vulnerabilites: [],
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        vulnerabilites: plan.vulnerabilites || [],
      });
    }
  }, [plan]);

  const editorDCSG = useEditor({
    extensions: [StarterKit],
    content: plan?.commentaire_dcsg || "",
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({
        ...prev,
        commentaire_dcsg: editor.getHTML(),
      })),
  });

  const editorCP = useEditor({
    extensions: [StarterKit],
    content: plan?.commentaire_cp || "",
    onUpdate: ({ editor }) =>
      setFormData((prev) => ({
        ...prev,
        commentaire_cp: editor.getHTML(),
      })),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const vulnStats = {
    total: formData.vulnerabilites.length,
    critique: formData.vulnerabilites.filter(v => v.criticite === "critique").length,
    majeure: formData.vulnerabilites.filter(v => v.criticite === "majeure").length,
    moderee: formData.vulnerabilites.filter(v => v.criticite === "moderee").length,
    mineure: formData.vulnerabilites.filter(v => v.criticite === "mineure").length,
  };  

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        nb_vulnerabilites: vulnStats,
      };
  
      await api.put(`/plan/plans/${plan.id}`, dataToSend);
      alert("Plan modifié avec succès !");
      fetchPlans();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      alert("Erreur lors de la modification !");
    }
  };  

  const handleVulnChange = (index, field, value) => {
    const newVulns = formData.vulnerabilites.map((vuln, i) =>
      i === index ? { ...vuln, [field]: value } : vuln
    );    
    setFormData({ ...formData, vulnerabilites: newVulns });
  };

  const addVulnField = () => {
    setFormData({
      ...formData,
      vulnerabilites: [
        ...formData.vulnerabilites,
        {
          id: uuidv4(), // id stable
          titre: "",
          criticite: "",
          pourcentage_remediation: 0,
          statut_remediation: "",
          actions: "",
        },
      ],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Modifier le Plan</DialogTitle>
      <DialogContent dividers>
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Informations Générales</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[
              { label: "Application", name: "application" },
              { label: "Type Application", name: "type_application" },
              { label: "Date Réalisation", name: "date_realisation", type: "date" },
              { label: "Date Clôture", name: "date_cloture", type: "date" },
              { label: "Date Rapport", name: "date_rapport", type: "date" },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  label={field.label}
                  name={field.name}
                  type={field.type || "text"}
                  value={formData[field.name]}
                  onChange={handleChange}
                  InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type Audit"
                name="type_audit"
                margin="dense"
                value={formData.type_audit}
                onChange={handleChange}
              >
                <MenuItem value="Pentest">Pentest</MenuItem>
                <MenuItem value="Architecture">Architecture</MenuItem>
                <MenuItem value="Configuration">Configuration</MenuItem>
                <MenuItem value="Reseau">Reseau</MenuItem>
                <MenuItem value="Code Source">Code Source</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Niveau Sécurité"
                name="niveau_securite"
                margin="dense"
                value={formData.niveau_securite}
                onChange={handleChange}
              >
                <MenuItem value="Bon">Bon</MenuItem>
                <MenuItem value="Moyen">Moyen</MenuItem>
                <MenuItem value="Faible">Faible</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Commentaires</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Commentaire DCSG</Typography>
            {editorDCSG && (
              <RichTextEditor editor={editorDCSG}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.CodeBlock />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1">Commentaire CP</Typography>
            {editorCP && (
              <RichTextEditor editor={editorCP}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.CodeBlock />
                  </RichTextEditor.ControlsGroup>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>
                <RichTextEditor.Content />
              </RichTextEditor>
            )}
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Vulnérabilités</Typography>
          <Divider sx={{ mb: 2 }} />
          {formData.vulnerabilites.map((vuln, index) => (
            <Paper
              key={vuln.id}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                boxShadow: 1,
                borderLeft: "4px solid #1976d2",
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Vulnérabilité #{index + 1}
              </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                  <TextField
                    label="Titre"
                    fullWidth
                    margin="dense"
                    value={vuln.titre}
                    onChange={(e) =>
                      handleVulnChange(index, "titre", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Criticité"
                    fullWidth
                    margin="dense"
                    select
                    value={vuln.criticite}
                    onChange={(e) =>
                      handleVulnChange(index, "criticite", e.target.value)
                    }
                  >
                    <MenuItem value="mineure">Mineure</MenuItem>
                    <MenuItem value="moderee">Modérée</MenuItem>
                    <MenuItem value="majeure">Majeure</MenuItem>
                    <MenuItem value="critique">Critique</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="% Remédiation"
                    type="number"
                    fullWidth
                    margin="dense"
                    value={vuln.pourcentage_remediation}
                    onChange={(e) =>
                      handleVulnChange(
                        index,
                        "pourcentage_remediation",
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Statut Remédiation"
                    fullWidth
                    margin="dense"
                    value={vuln.statut_remediation}
                    onChange={(e) =>
                      handleVulnChange(index, "statut_remediation", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Actions"
                    fullWidth
                    margin="dense"
                    value={vuln.actions}
                    onChange={(e) =>
                      handleVulnChange(index, "actions", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
              <Grid>
                <Button
                  color="error"
                  onClick={() => {
                    const newVulns = [...formData.vulnerabilites];
                    newVulns.splice(index, 1);
                    setFormData({ ...formData, vulnerabilites: newVulns });
                  }}
                >
                  Supprimer
                </Button>
              </Grid>
              
            </Paper>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addVulnField}
          >
            Ajouter une vulnérabilité
          </Button>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CancelIcon />}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanForm;
