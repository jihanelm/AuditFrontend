import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material';

const API_URL = 'http://localhost:8000/audits';

const AuditList = () => {
    const [audits, setAudits] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => setAudits(data))
            .catch(error => console.error('Erreur de chargement:', error));
    }, []);

    const fetchAuditDetails = (id) => {
        fetch(`${API_URL}/${id}`)
            .then(response => response.json())
            .then(data => setSelectedAudit(data))
            .catch(error => console.error('Erreur de chargement des détails:', error));
    };

    const updateAuditEtat = (id, etat, e) => {
        e.stopPropagation();
        fetch(`${API_URL}/${id}/update-etat?etat=${etat}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(updatedAudit => {
            setAudits(prevAudits => 
                prevAudits.map(audit => audit.id === id ? { ...audit, etat: updatedAudit.etat } : audit)
            );
            if (selectedAudit && selectedAudit.id === id) {
                setSelectedAudit(updatedAudit);
            }
        })
        .catch(error => console.error('Erreur de mise à jour:', error));
    };

    const handleAffecter = (auditId) => {
        const auditToAssign = audits.find(audit => audit.id === auditId);
        navigate('/assign', { state: { auditData: auditToAssign } });
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Liste des Audits</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Date de création</TableCell>
                            <TableCell>État</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audits.map(audit => (
                            <TableRow key={audit.id} hover onClick={() => fetchAuditDetails(audit.id)}>
                                <TableCell>{audit.id}</TableCell>
                                <TableCell>{new Date(audit.date_creation).toLocaleDateString()}</TableCell>
                                <TableCell>{audit.etat}</TableCell>
                                <TableCell>
                                    <Button color="success" onClick={(e) => updateAuditEtat(audit.id, 'Validé', e)}>Valider</Button>
                                    <Button color="error" onClick={(e) => updateAuditEtat(audit.id, 'Rejeté', e)}>Rejeter</Button>
                                    <Button color="primary" onClick={(e) => { e.stopPropagation(); handleAffecter(audit.id); }}>Affecter</Button>
                                    <Button color="secondary" onClick={(e) => { e.stopPropagation(); handleAffecter(audit.id); }}>Ajouter au Plan</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedAudit && (
                <Dialog open={Boolean(selectedAudit)} onClose={() => setSelectedAudit(null)}>
                    <DialogTitle>Détails de l'Audit #{selectedAudit.id}</DialogTitle>
                    <DialogContent>
                        <Typography><strong>Date de création:</strong> {new Date(selectedAudit.date_creation).toLocaleString()}</Typography>
                        <Typography><strong>État:</strong> {selectedAudit.etat}</Typography>
                        <Typography><strong>Nom:</strong> {selectedAudit.demandeur_nom}</Typography>
                        <Typography><strong>Prénom:</strong> {selectedAudit.demandeur_prenom}</Typography>
                        <Typography><strong>Email:</strong> {selectedAudit.demandeur_email}</Typography>
                        <Typography><strong>Téléphone:</strong> {selectedAudit.demandeur_phone}</Typography>
                        <Typography><strong>Département:</strong> {selectedAudit.demandeur_departement}</Typography>
                        <Typography><strong>Type d'audit:</strong> {selectedAudit.type_audit}</Typography>
                        <Typography><strong>Description:</strong> {selectedAudit.description}</Typography>
                        <Typography><strong>Objectif:</strong> {selectedAudit.objectif}</Typography>
                        <Typography><strong>Urgence:</strong> {selectedAudit.urgence}</Typography>
                        <Typography><strong>Domain Name:</strong> {selectedAudit.domain_name}</Typography>
                        {selectedAudit.fichier_attache && (
                            <Typography>
                                <strong>Fichier attaché:</strong> <a href={`http://localhost:8000/${selectedAudit.fichier_attache}`} target="_blank" rel="noopener noreferrer">Télécharger</a>
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedAudit(null)} color="primary">Fermer</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default AuditList;
