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
import api from "../../api";

const DemandeList = () => {
    const [audits, setAudits] = useState([]);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAudits = async () => {
            try {
                const response = await api.get("/audits");
                setAudits(response.data);
            } catch (error) {
                console.error('Erreur de chargement:', error);
            }
        };

        fetchAudits();
    }, []);

    const fetchAuditDetails = async (id) => {
        try {
            const response = await api.get(`/audits/${id}`);
            setSelectedAudit(response.data); // Assuming the response data is in `data`
        } catch (error) {
            console.error('Erreur de chargement des détails:', error);
        }
    };

    const updateAuditEtat = async (id, etat, e) => {
        e.stopPropagation();
        try {
            const response = await api.patch(`/audits/${id}/update-etat`, null, {
                params: { etat }
            });
            const updatedAudit = response.data;
            setAudits(prevAudits =>
                prevAudits.map(audit =>
                    audit.id === id ? { ...audit, etat: updatedAudit.etat } : audit
                )
            );
            if (selectedAudit && selectedAudit.id === id) {
                setSelectedAudit(updatedAudit);
            }
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
        }
    };
    

    const handleAffecter = (auditId) => {
        const auditToAssign = audits.find(audit => audit.id === auditId);
        navigate('/assign', { state: { auditData: auditToAssign } });
    };

    

    return (
        <>
            <Typography variant="h4" gutterBottom>Liste des Demandes d'Audits</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom d'Application</TableCell>
                            <TableCell>Date de création</TableCell>
                            <TableCell>État</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audits.map(audit => (
                            <TableRow key={audit.id} hover onClick={() => fetchAuditDetails(audit.id)}>
                                <TableCell>{audit.nom_app}</TableCell>
                                <TableCell>{new Date(audit.date_creation).toLocaleDateString()}</TableCell>
                                <TableCell>{audit.etat}</TableCell>
                                <TableCell>
                                    <Button color="success" onClick={(e) => updateAuditEtat(audit.id, 'Validé', e)}>Valider</Button>
                                    <Button color="error" onClick={(e) => updateAuditEtat(audit.id, 'Rejeté', e)}>Rejeter</Button>
                                    <Button color="primary" onClick={(e) => { e.stopPropagation(); handleAffecter(audit.id); }}>Affecter</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedAudit && (
                <Dialog open={Boolean(selectedAudit)} onClose={() => setSelectedAudit(null)} maxWidth="md" fullWidth>
                    <DialogTitle>Détails de l'Audit #{selectedAudit.id}</DialogTitle>
                    <DialogContent dividers>
                    <TableContainer component={Paper}>
                        <Table>
                        <TableBody>
                            {/* Contact Primaire */}
                            <TableRow><TableCell colSpan={2}><strong>Contact Primaire</strong></TableCell></TableRow>
                            <TableRow><TableCell>Nom</TableCell><TableCell>{selectedAudit.demandeur_nom_1}</TableCell></TableRow>
                            <TableRow><TableCell>Prénom</TableCell><TableCell>{selectedAudit.demandeur_prenom_1}</TableCell></TableRow>
                            <TableRow><TableCell>Email</TableCell><TableCell>{selectedAudit.demandeur_email_1}</TableCell></TableRow>
                            <TableRow><TableCell>Entité</TableCell><TableCell>{selectedAudit.demandeur_entite_1}</TableCell></TableRow>

                            {/* Contact Secondaire */}
                            <TableRow><TableCell colSpan={2}><strong>Contact Secondaire</strong></TableCell></TableRow>
                            <TableRow><TableCell>Nom</TableCell><TableCell>{selectedAudit.demandeur_nom_2}</TableCell></TableRow>
                            <TableRow><TableCell>Prénom</TableCell><TableCell>{selectedAudit.demandeur_prenom_2}</TableCell></TableRow>
                            <TableRow><TableCell>Email</TableCell><TableCell>{selectedAudit.demandeur_email_2}</TableCell></TableRow>
                            <TableRow><TableCell>Entité</TableCell><TableCell>{selectedAudit.demandeur_entite_2}</TableCell></TableRow>

                            {/* Infos Application */}
                            <TableRow><TableCell colSpan={2}><strong>Application</strong></TableCell></TableRow>
                            <TableRow><TableCell>Nom</TableCell><TableCell>{selectedAudit.nom_app}</TableCell></TableRow>
                            <TableRow><TableCell>Description</TableCell><TableCell>{selectedAudit.description}</TableCell></TableRow>
                            <TableRow><TableCell>Fonctionnalités</TableCell><TableCell>{selectedAudit.liste_fonctionalites}</TableCell></TableRow>
                            <TableRow><TableCell>Type</TableCell><TableCell>{selectedAudit.type_app} {selectedAudit.type_app_2}</TableCell></TableRow>

                            {/* Architecture & sécurité */}
                            <TableRow><TableCell colSpan={2}><strong>Sécurité</strong></TableCell></TableRow>
                            <TableRow><TableCell>Architecture projet</TableCell><TableCell>{selectedAudit.architecture_projet ? 'Oui' : 'Non'}</TableCell></TableRow>
                            <TableRow><TableCell>Commentaires Archi</TableCell><TableCell>{selectedAudit.commentaires_archi}</TableCell></TableRow>
                            <TableRow><TableCell>Protection WAF</TableCell><TableCell>{selectedAudit.protection_waf ? 'Oui' : 'Non'}</TableCell></TableRow>
                            <TableRow><TableCell>Commentaires WAF</TableCell><TableCell>{selectedAudit.commentaires_waf}</TableCell></TableRow>
                            <TableRow><TableCell>Ports exposés</TableCell><TableCell>{selectedAudit.ports ? 'Oui' : 'Non'}</TableCell></TableRow>
                            <TableRow><TableCell>Liste des ports</TableCell><TableCell>{selectedAudit.liste_ports}</TableCell></TableRow>
                            <TableRow><TableCell>Certificat SSL</TableCell><TableCell>{selectedAudit.cert_ssl_domain_name ? 'Oui' : 'Non'}</TableCell></TableRow>
                            <TableRow><TableCell>Commentaires SSL</TableCell><TableCell>{selectedAudit.commentaires_cert_ssl_domain_name}</TableCell></TableRow>

                            {/* Système */}
                            <TableRow><TableCell colSpan={2}><strong>Système & Environnement</strong></TableCell></TableRow>
                            <TableRow><TableCell>OS</TableCell><TableCell>{selectedAudit.sys_exploitation}</TableCell></TableRow>
                            <TableRow><TableCell>Logiciels installés</TableCell><TableCell>{selectedAudit.logiciels_installes}</TableCell></TableRow>
                            <TableRow><TableCell>Environnement de test</TableCell><TableCell>{selectedAudit.env_tests}</TableCell></TableRow>
                            <TableRow><TableCell>Données de prod</TableCell><TableCell>{selectedAudit.donnees_prod ? 'Oui' : 'Non'}</TableCell></TableRow>
                            <TableRow><TableCell>SI actifs</TableCell><TableCell>{selectedAudit.liste_si_actifs}</TableCell></TableRow>
                            <TableRow><TableCell>Compte admin</TableCell><TableCell>{selectedAudit.compte_admin}</TableCell></TableRow>
                            <TableRow><TableCell>Nom de domaine</TableCell><TableCell>{selectedAudit.nom_domaine}</TableCell></TableRow>
                            <TableRow><TableCell>URL App</TableCell><TableCell>{selectedAudit.url_app}</TableCell></TableRow>
                            <TableRow><TableCell>Compte test</TableCell><TableCell>{selectedAudit.compte_test_profile}</TableCell></TableRow>
                            <TableRow><TableCell>Urgence</TableCell><TableCell>{selectedAudit.urgence}</TableCell></TableRow>

                            {/* Fichiers */}
                            {selectedAudit.fichiers_attaches?.length > 0 && (
                            <TableRow>
                                <TableCell>Fichiers attachés</TableCell>
                                <TableCell>
                                <ul>
                                    {selectedAudit.fichiers_attaches.map((file, idx) => (
                                    <li key={idx}>
                                        <a href={`http://localhost:8000/${file}`} target="_blank" rel="noopener noreferrer">
                                        Télécharger fichier {idx + 1}
                                        </a>
                                    </li>
                                    ))}
                                </ul>
                                </TableCell>
                            </TableRow>
                            )}
                            {selectedAudit.fiche_demande_path && (
                            <TableRow>
                                <TableCell>Fiche Demande</TableCell>
                                <TableCell>
                                <a href={`http://localhost:8000/${selectedAudit.fiche_demande_path}`} target="_blank" rel="noopener noreferrer">
                                    Télécharger
                                </a>
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </TableContainer>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setSelectedAudit(null)} color="primary">Fermer</Button>
                    </DialogActions>
                </Dialog>
                )}
        </>
    );
};

export default DemandeList;
