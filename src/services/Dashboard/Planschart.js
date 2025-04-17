import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const months = [
  "", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"
];

const PlansChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/dash/audits-par-mois")
      .then((res) => {
        const chartData = res.data.map((item) => ({
          mois: months[item.mois],
          nombre: item.nombre
        }));
        setData(chartData);
      })
      .catch((err) => console.error("Erreur chargement graph plans:", err));
  }, []);

  return (
    <Card sx={{ mt: 4, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Nombre de audits créés par mois
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="nombre" fill="#009688" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PlansChart;
