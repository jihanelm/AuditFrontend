import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import { MantineProvider } from '@mantine/core';
import '@mantine/tiptap/styles.css';

import Main from './layout/components/Main';

import AuditRequest from './services/AuditRequest/AuditRequest';
import DemandeList from './services/AuditRequest/DemandeList';

import AffectationForm from './services/Affectation/AffectationForm';
import AffectList from './services/Affectation/AffectList';

import AuditeurPage from './services/Affectation/AuditeurPage';
import IPList from './services/Affectation/IPList';

import PlanService from './services/Plan/PlanService';

import ListesAudit from './services/Audit/ListesAudit';

import Dashboard from './services/Dashboard/Dashboard';

import Landing from './layout/components/Landing';
import Footer from './layout/components/Footer';
import AuditList from './services/Audit/AuditList';
import PlanManager from './services/Plan/PlanManager';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Container maxWidth="md" sx={{ flex: 1, mt: 4 }}>
              <Routes>
                <Route path="/" element={<Main />} />

                <Route path="/demande" element={<AuditRequest />} />
                <Route path="/demande-list" element={<DemandeList />} />

                <Route path="/assign" element={<AffectationForm />} />
                <Route path="/affect-list" element={<AffectList />} />

                <Route path="/auditeurs-list" element={<AuditeurPage />} />
                <Route path="/ip-list" element={<IPList />} />

                <Route path="/plan" element={<PlanService />} />
                <Route path="/plan1" element={<PlanManager />} />

                <Route path="/list" element={<ListesAudit />} />
                <Route path="/list1" element={<AuditList />} />

                <Route path="/dash" element={<Dashboard />} />

                <Route path="/land" element={<Landing />} />
              </Routes>
            </Container>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;
