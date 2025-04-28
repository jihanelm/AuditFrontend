import { useEffect, useState } from 'react';
import { fetchAudits } from './AuditService';
import { Card, Typography, CardContent } from '@mui/material';

const AuditList = () => {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    fetchAudits().then(res => setAudits(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h6">Liste des Audits</Typography>
      {audits.map(audit => (
        <Card key={audit.id} sx={{ my: 2 }}>
          <CardContent>
            <Typography>ID: {audit.id}</Typography>
            <Typography>Durée: {audit.duree}</Typography>
            <Typography>État: {audit.etat}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AuditList;
