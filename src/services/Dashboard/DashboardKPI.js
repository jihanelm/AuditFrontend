import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Assessment, Group, Work, BarChart, TrackChanges } from "@mui/icons-material";

const COLORS = ["#4E79A7", "#A0CBE8", "#F28E2B", "#FFBE7D", "#59A14F"];

const KPIBox = ({ title, value, icon }) => (
  <Card sx={{ borderRadius: 2, p: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2}>
        {icon}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardKPI = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dash/kpis")
      .then((res) => {
        setKpis(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement KPI", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Total Auditeurs"
          value={kpis.auditeurs_total}
          icon={<Group color="primary" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Total Prestataires"
          value={kpis.prestataires_total}
          icon={<Work color="secondary" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Taux d'occupation"
          value={`${kpis.taux_occupation_auditeurs}%`}
          icon={<TrackChanges color="success" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Audits en cours"
          value={kpis.audits_en_cours}
          icon={<BarChart color="warning" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Audits suspendu"
          value={kpis.audits_suspendu}
          icon={<BarChart color="secondary" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Audits terminés"
          value={kpis.audits_termines}
          icon={<BarChart color="primary" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <KPIBox
          title="Affectations actives"
          value={kpis.affectations_actives}
          icon={<Assessment color="error" />}
        />
      </Grid>
    </Grid>
    <Grid container spacing={2} mt={1.5}>
      {Array.isArray(kpis.types_audit) && (
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Répartition des types d’audits
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={kpis.types_audit}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {kpis.types_audit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
    </>
  );
};

export default DashboardKPI;
