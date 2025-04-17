import React from "react";
import { Container, Typography } from "@mui/material";
import DashboardKPI from "./DashboardKPI";
import PlansChart from "./Planschart";
import TopPrestatairesChart from "./TopPrestatairesChart";

const Dashboard = () => (
  <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Tableau de bord
    </Typography>
    <DashboardKPI />
    <TopPrestatairesChart />
    <PlansChart />
  </Container>
);

export default Dashboard;
