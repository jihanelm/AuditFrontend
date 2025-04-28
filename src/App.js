import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';

import Main from './layout/components/Main';

import AuditRequest from './services/AuditRequest/AuditRequest';
import DemandeList from './services/AuditRequest/DemandeList';

import AffectationForm from './services/Affectation/AffectationForm';
import AffectList from './services/Affectation/AffectList';

import AuditeurPage from './services/Affectation/AuditeurPage';
import IPList from './services/Affectation/IPList';

import Plan from './services/Plan/Plan';
import PlanServiceV1 from './services/Plan/PlanServiceV1';
import PlanServiceV2 from './services/Plan/PlanServiceV2';
import PlanServiceV3 from './services/Plan/PlanServiceV3';
import PlanServiceV4 from './services/Plan/PlanServiceV4';
import PlanService from './services/Plan/PlanService';

import ListesAudit from './services/Audit/ListesAudit';

import Dashboard from './services/Dashboard/Dashboard';

import Landing from './layout/components/Landing';
import Footer from './layout/components/Footer';
import AuditList from './services/Audit/AuditList';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header or Nav if needed */}
          <Container maxWidth="md" sx={{ flex: 1, mt: 4 }}>
            <Routes>
              <Route path="/" element={<Main />} />

              <Route path="/demande" element={<AuditRequest />} />
              <Route path="/demande-list" element={<DemandeList />} />

              <Route path="/assign" element={<AffectationForm />} />
              <Route path="/affect-list" element={<AffectList />} />

              <Route path="/auditeurs-list" element={<AuditeurPage />} />
              <Route path="/ip-list" element={<IPList />} />  

              <Route path="/upload" element={<Plan />} />
              <Route path='/plan1' element={<PlanServiceV1 />} />
              <Route path='/plan2' element={<PlanServiceV2 />} />
              <Route path='/plan3' element={<PlanServiceV3 />} />
              <Route path='/plan4' element={<PlanServiceV4 />} />
              <Route path='/plan' element={<PlanService />} />

              <Route path='/list' element={<ListesAudit />} />
              <Route path='/list1' element={<AuditList />} />

              <Route path='/dash' element={<Dashboard />} />

              <Route path='/land' element={<Landing />} />
            </Routes>
          </Container>
          <Footer /> 
        </Box>
      </Router>
    </ThemeProvider>
  );
}


export default App;
