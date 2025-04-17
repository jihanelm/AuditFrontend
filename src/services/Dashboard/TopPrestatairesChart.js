import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import api from "../../api";

const COLORS = ["#1976d2", "#0288d1", "#009688", "#7cb342", "#f9a825"];

const TopPrestatairesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/dash/affect-prestataires")
    .then(res => {
        console.log("Prestataires reçus :", res.data);
        setData(res.data);
      })
      .catch(err => console.error("Erreur de chargement des prestataires", err));
  }, []);

  return (
    <Card sx={{ mt: 4, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Les prestataires les plus affectés
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nom" type="category" />
              <Tooltip />
              <Bar dataKey="affectations" fill="#1976d2">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopPrestatairesChart;
