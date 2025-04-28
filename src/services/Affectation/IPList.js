import React, { useEffect, useState } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import api from "../../api";

const IPList = () => {
  const [ips, setIps] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/affectation/ips")
      .then(response => {
        console.log("API Response:", response.data);
        setIps(response.data);
      })
      .catch(error => console.error("Erreur de chargement des IPs", error));
  }, []);
  
  const filteredIps = ips.filter(ip => ip.adresse_ip?.includes(search));

  return (
    <Paper sx={{ padding: 4, maxWidth: 800, margin: "auto", marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>Liste des IPs</Typography>
      <TextField
        label="Rechercher une IP..."
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Adresse IP</TableCell>
              <TableCell>Port</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Affectation ID</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIps.map((ip) => (
              <TableRow key={ip.id}>
                <TableCell>{ip.id}</TableCell>
                <TableCell>{ip.adresse_ip}</TableCell>
                <TableCell>
                  {Array.isArray(ip.ports) && ip.ports.length > 0
                    ? ip.ports.map((p) => p.port).join(", ")
                    : "-"}
                </TableCell>
                <TableCell>{ip.status}</TableCell>
                <TableCell>{ip.affectation_id}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small">Voir Audit</Button>
                  <Button variant="contained" color="error" size="small">Fermer</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default IPList;
