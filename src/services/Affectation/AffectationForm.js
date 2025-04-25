import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Box, Container, Typography, TextField, Button, 
  Select, MenuItem, FormControl, InputLabel, Card, Grid, 
  CardContent, Checkbox, Dialog, DialogTitle, DialogContent, 
  DialogActions, Table, TableBody, TableCell, TableRow,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../api";

const AffectationForm = () => {
  const location = useLocation();
  const auditData = location.state?.auditData || {};

  const [auditeurToDelete, setAuditeurToDelete] = useState(null);

  const [prestataires, setPrestataires] = useState([]);
  const [auditeurs, setAuditeurs] = useState([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState("");
  const [selectedAuditeurs, setSelectedAuditeurs] = useState([]);
  const [ips, setIps] = useState([{ adresse_ip: "", ports: [""] }]);
  const [affectationFile, setAffectationFile] = useState(null);
  const [editingAuditeur, setEditingAuditeur] = useState(null);
  const [selectedTypeAudit, setSelectedTypeAudit] = useState("");

  // États pour ajout d'auditeur manuel
  const [manualAuditor, setManualAuditor] = useState({ nom: "", prenom: "", email: "", phone: "", prestataire_id: selectedPrestataire});
  const [manualPrestataire, setManualPrestataire] = useState({ nom: ""});

  
 

  // Mettre à jour `prestataire_id` lorsque `selectedPrestataire` change
  useEffect(() => {
    setManualAuditor((prev) => ({ ...prev, prestataire_id: selectedPrestataire }));
  }, [selectedPrestataire]);

  const addIp = () => {
    setIps([...ips, { adresse_ip: "", ports: [""] }]);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPrestataires();
      await fetchAuditeurs();
    };
    fetchData();
  }, []);

  // Ajouter un auditeur manuellement
  const handleAddAuditor = async () => {
    if (!manualAuditor.nom || !manualAuditor.prenom || !manualAuditor.email || !manualAuditor.phone) {
      <TextField
        error={!manualAuditor.nom}
        helperText={!manualAuditor.nom ? "Le nom est requis" : ""}
      />
      return;
    }

    try {
      const response = await api.post("/affectation/auditeurs", manualAuditor);
      setAuditeurs([...auditeurs, response.data]);
      setSelectedAuditeurs([...selectedAuditeurs, response.data.id]);
      setManualAuditor({ nom: "", prenom: "", email: "", phone: "", prestataire_id: selectedPrestataire });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'auditeur:", error);
      alert("Une erreur est survenue lors de l'ajout de l'auditeur.");
    }
  };

  const handleToggle = useCallback((id) => {
    setSelectedAuditeurs((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }, []);

  // Confirmation suppression
  const confirmDelete = (auditeur) => {
    setAuditeurToDelete(auditeur);
  };

  // Suppression de l’auditeur après confirmation
  const handleDelete = async () => {
    try {
      await api.delete(`/affectation/auditeurs/${auditeurToDelete.id}`);
      setAuditeurs(auditeurs.filter((a) => a.id !== auditeurToDelete.id));
      setSelectedAuditeurs(selectedAuditeurs.filter((id) => id !== auditeurToDelete.id));
      setAuditeurToDelete(null);
    } catch (err) {
      console.error("Erreur de suppression :", err);
      alert("Erreur lors de la suppression de l’auditeur.");
    }
  };

  // Ajouter un prestataire manuellement
  const handleAddPrestataire = async () => {
    if (!manualPrestataire.nom) {
      alert("Veuillez remplir tous les champs de l'auditeur.");
      return;
    }

    try {
      const response = await api.post("/affectation/prestataires", manualPrestataire);
      setPrestataires([...prestataires, response.data]);
      setSelectedPrestataire(response.data.id);
      setManualPrestataire({ nom: ""});
    } catch (error) {
      console.error("Erreur lors de l'ajout du prestataire:", error);
      alert("Une erreur est survenue lors de l'ajout du prestataire.");
    }
  };

  const handleIpChange = (index, field, value) => {
    const updated = [...ips];
    updated[index][field] = value;
    setIps(updated);
  };
  
  const handlePortChange = (ipIndex, portIndex, value) => {
    const updated = [...ips];
    updated[ipIndex].ports[portIndex] = value;
    setIps(updated);
  };
  
  const addPort = (ipIndex) => {
    const updated = [...ips];
    updated[ipIndex].ports.push("");
    setIps(updated);
  };
  
  const removePort = (ipIndex, portIndex) => {
    const updated = [...ips];
    updated[ipIndex].ports.splice(portIndex, 1);
    setIps(updated);
    if (updated[ipIndex].ports.length > 1) {
      updated[ipIndex].ports.splice(portIndex, 1);
    }    
  };

  const ipsFormatted = ips.map(ip => ({
    adresse_ip: ip.adresse_ip,
    ports: ip.ports.map(port => ({
      port: isNaN(parseInt(port)) ? 0 : parseInt(port),
      status: "open",
    }))
  }));
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    const affectationData = {
      type_audit: selectedTypeAudit,
      demande_audit_id: auditData.id,
      prestataire_id: selectedPrestataire,
      auditeurs: selectedAuditeurs.map((id) => {
        const auditor = auditeurs.find((a) => a.id === id);
        return {
          nom: auditor.nom,
          prenom: auditor.prenom,
          email: auditor.email,
          phone: auditor.phone,
          prestataire_id: auditor.prestataire_id,
        };
      }),
      ips: ipsFormatted,
    };

    try {
      const response = await api.post("/affectation/affects", affectationData, {
        headers: {"Content-Type": "application/json"},
      });
      alert("Affectation créée avec succès !");
      setAffectationFile(response.data.affectationpath);
    } catch (error) {
      console.error("Erreur lors de l'affectation:", error);
      alert("Erreur lors de l'affectation:", error);
      console.log("Affectation Data: ", affectationData);
    }
  };
    
      const fetchAuditeurs = async () => {
        try {
          const response = await api.get("/affectation/auditeurs/");
          setAuditeurs(response.data);
        } catch (error) {
          console.error("Erreur fetchAuditeurs :", error);
        }
      };
      
      const fetchPrestataires = async () => {
        try {
          const response = await api.get("/affectation/prestataires/");
          setPrestataires(response.data);
        } catch (error) {
          console.error("Erreur fetchPrestataires :", error);
        }
      };  
    

    
      const handleUpdate = async (auditeur) => {
        try {
          const updatedData = {
            nom: auditeur.nom,
            prenom: auditeur.prenom,
            email: auditeur.email,
            phone: auditeur.phone,
            prestataire_id: auditeur.prestataire_id
          };
          await api.put(`/affectation/auditeurs/${auditeur.id}`, updatedData);
          setAuditeurs((prev) =>
            prev.map((a) => (a.id === auditeur.id ? { ...a, ...updatedData } : a))
          );
          setEditingAuditeur(null);
        } catch (error) {
          console.error("Erreur handleUpdate :", error.response?.data || error.message);
          alert("Erreur lors de la mise à jour de l'auditeur.");
        }
      };
      
       
    
      const filteredAuditeurs = selectedPrestataire
        ? auditeurs.filter((a) => a.prestataire_id === parseInt(selectedPrestataire))
        : auditeurs;
    
        const columns = [
          {
            field: 'check',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params) => (
              <Checkbox
                checked={selectedAuditeurs.includes(params.row.id)}
                onChange={() => handleToggle(params.row.id)}
              />
            ),
          },
          { field: 'id', headerName: 'ID', width: 70 },
          { field: 'nom', headerName: 'Nom', flex: 1 },
          { field: 'prenom', headerName: 'Prénom', flex: 1 },
          { field: 'email', headerName: 'Email', flex: 1 },
          { field: 'phone', headerName: 'Téléphone', flex: 1 },
          {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setEditingAuditeur(params.row)}
                >
                  Modifier
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => confirmDelete(params.row)}
                  style={{ marginLeft: 8 }}
                >
                  Supprimer
                </Button>
              </>
            ),
          },
        ];

        const isAuditorValid = (auditeur) =>
          auditeur.nom && auditeur.prenom && auditeur.email && auditeur.phone;
        

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Fiche d'Affectation
      </Typography>

      {/* Informations de l'audit */}
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Informations de l'Audit
        </Typography>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}><strong>Contact Primaire</strong></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Nom :</strong></TableCell>
              <TableCell>{auditData.demandeur_nom_1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Prénom :</strong></TableCell>
              <TableCell>{auditData.demandeur_prenom_1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email :</strong></TableCell>
              <TableCell>{auditData.demandeur_email_1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Téléphone :</strong></TableCell>
              <TableCell>{auditData.demandeur_phone_1}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Entité :</strong></TableCell>
              <TableCell>{auditData.demandeur_entite_1}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={2}><strong>Contact Secondaire</strong></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Nom :</strong></TableCell>
              <TableCell>{auditData.demandeur_nom_2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Prénom :</strong></TableCell>
              <TableCell>{auditData.demandeur_prenom_2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email :</strong></TableCell>
              <TableCell>{auditData.demandeur_email_2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Téléphone :</strong></TableCell>
              <TableCell>{auditData.demandeur_phone_2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Entité :</strong></TableCell>
              <TableCell>{auditData.demandeur_entite_2}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Nom de l'Application :</strong></TableCell>
              <TableCell>{auditData.nom_app}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Type d'audit :</strong></TableCell>
              <TableCell>{auditData.type_audit}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Description :</strong></TableCell>
              <TableCell>{auditData.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Urgence :</strong></TableCell>
              <TableCell>{auditData.urgence}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Nom Domaine :</strong></TableCell>
              <TableCell>{auditData.nom_domaine}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Fichiers :</strong></TableCell>
              <TableCell>
                <ul>
                  {auditData.fichiers_attaches.map((file, idx) => (
                    <li key={idx}>
                      <a href={`http://localhost:8000/${file}`} target="_blank" rel="noopener noreferrer">
                        Télécharger fichier {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Voir la demande d'audit :</strong></TableCell>
              <TableCell>
                <a href={`http://localhost:8000/${auditData.fiche_demande_path}`} target="_blank" rel="noopener noreferrer">
                  Télécharger
                </a>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

      {/* Formulaire d'affectation */}
      <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
      <InputLabel>Type d'audit</InputLabel>
      <Select
        value={selectedTypeAudit}
        onChange={(e) => setSelectedTypeAudit(e.target.value)}
        required
      >
        <MenuItem value="Audit Pentest">Audit Pentest</MenuItem>
        <MenuItem value="Audit Architecture">Audit Architecture</MenuItem>
        <MenuItem value="Audit Configuration">Audit Configuration</MenuItem>
        <MenuItem value="Audit Réseau">Audit Réseau</MenuItem>
        <MenuItem value="Audit Code Source">Audit Code Source</MenuItem>
      </Select>
    </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Prestataire</InputLabel>
          <Select value={selectedPrestataire || ""} onChange={(e) => setSelectedPrestataire(e.target.value)}>
            {prestataires.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Ajouter un prestataire manuellement */}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Ajouter un nouveau prestataire
        </Typography>
        <TextField label="Nom" fullWidth margin="normal" value={manualPrestataire.nom} onChange={(e) => setManualPrestataire({ ...manualPrestataire, nom: e.target.value })} />
        <Button variant="outlined" color="secondary" onClick={handleAddPrestataire}>
          Ajouter
        </Button>

        <Box p={3}>
      <Typography variant="h6" gutterBottom>Liste des Auditeurs</Typography>

      

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={filteredAuditeurs} columns={columns} pageSize={7} />
      </div>

      {/* Dialog Modification */}
      <Dialog open={!!editingAuditeur} onClose={() => setEditingAuditeur(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier un auditeur</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {["nom", "prenom", "email", "phone"].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  label={field.toUpperCase()}
                  value={editingAuditeur?.[field] || ""}
                  onChange={(e) =>
                    setEditingAuditeur({ ...editingAuditeur, [field]: e.target.value })
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Select
                fullWidth
                value={editingAuditeur?.prestataire_id || ""}
                onChange={(e) =>
                  setEditingAuditeur({
                    ...editingAuditeur,
                    prestataire_id: parseInt(e.target.value),
                  })
                }
              >
                {prestataires.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nom}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingAuditeur(null)}>Annuler</Button>
          <Button
            onClick={() => handleUpdate(editingAuditeur)}
            variant="contained"
            >
            Enregistrer
            </Button>

        </DialogActions>
      </Dialog>
    </Box>

      {/* Confirmation avant suppression */}
      <Dialog open={Boolean(auditeurToDelete)} onClose={() => setAuditeurToDelete(null)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer l’auditeur <strong>{auditeurToDelete?.nom} {auditeurToDelete?.prenom}</strong> ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuditeurToDelete(null)} color="primary">Annuler</Button>
          <Button onClick={handleDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>

        {/* Ajouter un auditeur manuellement */}
        <Typography variant="h6" style={{ marginTop: "20px" }}>
          Ajouter un nouveau auditeur
        </Typography>
        <TextField label="Nom" fullWidth margin="normal" value={manualAuditor.nom} onChange={(e) => setManualAuditor({ ...manualAuditor, nom: e.target.value })} />
        <TextField label="Prénom" fullWidth margin="normal" value={manualAuditor.prenom} onChange={(e) => setManualAuditor({ ...manualAuditor, prenom: e.target.value })} />
        <TextField label="Email" fullWidth margin="normal" value={manualAuditor.email} onChange={(e) => setManualAuditor({ ...manualAuditor, email: e.target.value })} />
        <TextField label="Téléphone" fullWidth margin="normal" value={manualAuditor.phone} onChange={(e) => setManualAuditor({ ...manualAuditor, phone: e.target.value })} />
        <Button variant="outlined" color="secondary" onClick={handleAddAuditor}>
          Ajouter
        </Button>

        <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>Adresses IP</Typography>
        {ips.map((ip, index) => (
          <Card key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Adresse IP"
                  value={ip.adresse_ip}
                  onChange={(e) =>
                    handleIpChange(index, "adresse_ip", e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {ip.ports.map((port, portIndex) => (
                  <Grid container spacing={1} alignItems="center" key={portIndex} sx={{ mb: 1 }}>
                    <Grid item xs={8}>
                      <TextField
                        fullWidth
                        type="number"
                        label={`Port ${portIndex + 1}`}
                        value={port}
                        onChange={(e) =>
                          handlePortChange(index, portIndex, e.target.value)
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {ip.ports.length > 1 && (
                        <Button color="error" onClick={() => removePort(index, portIndex)}>
                          Supprimer
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addPort(index)}
                >
                  + Ajouter un port
                </Button>
              </Grid>
            </Grid>
          </Card>
        ))}

        <Button onClick={addIp} variant="contained" color="primary" style={{ marginTop: 10 }}>+ Ajouter une IP</Button>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px", marginLeft: "120px" }}>
          Valider l'affectation
        </Button>

        
        {affectationFile && (
          <Button
            variant="contained"
            color="success"
            href={`http://localhost:8000/${affectationFile}`}
            target="_blank"
            style={{ marginTop: "20px" }}
          >
            Voir la fiche d’affectation
          </Button>
        )}  
      
      </form>
    </Container>
  );
};

export default AffectationForm;
