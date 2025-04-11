import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';

import Main from './layout/components/Main';
import AuditRequest from './services/AuditRequest/AuditRequestForm';
import AuditList from './services/AuditRequest/AuditList';
import AffectationForm from './services/Affectation/AffectationForm';
import AuditeurPage from './services/Affectation/AuditeurPage';
import Plan from './services/Plan/Plan';
import AffectList from './services/Affectation/AffectList';
import IPList from './services/Affectation/IPList';
import PlanServiceV1 from './services/Plan/PlanServiceV1';
import PlanServiceV2 from './services/Plan/PlanServiceV2';
import PlanService from './services/Plan/PlanService';

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

  const [filters, setFilters] = useState({
    year: "",
    month: "",
    type_audit: "",
    status: "",
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Container maxWidth="md" sx={{ flexGrow: 1, mt: 4 }}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/request" element={<AuditRequest />} />
              <Route path="/audit-list" element={<AuditList />} />
              <Route path="/assign" element={<AffectationForm />} />
              <Route path="/affect-list" element={<AffectList />} />
              <Route path="/auditeurs-list" element={<AuditeurPage />} />
              <Route path="/upload" element={<Plan />} />
              <Route path="/ip-list" element={<IPList />} />  
              <Route path='/plan1' element={<PlanServiceV1 />} />
              <Route path='/plan2' element={<PlanServiceV2 />} />
              <Route path='/plan' element={<PlanService />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
