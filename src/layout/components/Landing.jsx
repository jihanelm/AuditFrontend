import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Paper,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const features = [
    'Real-time Audit Tracking',
    'Smart Resource Allocation',
    'Excel & PDF Report Generation',
    'Role-based Access Control',
  ];

const LandingPage = () => {
  return (
    <main>
      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            WELCOME TO <span style={{ color: '#42a5f5' }}>AuditFlow</span>
          </Typography>
          <Typography variant="h6" mb={4}>
            Empower yourself with cutting-edge audit management tools!
          </Typography>
          <Button
            variant="contained"
            href="#features"
            sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
          >
            Get In Touch
          </Button>
          <Box mt={6}>
            <ArrowDownwardIcon fontSize="large" sx={{ animation: 'bounce 2s infinite' }} />
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, bgcolor: '#f4f6f8' }}>
        <Container sx={{ py: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                  <CheckCircleIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {feature}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 8, bgcolor: '#f4f6f8' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <Box
            component="form"
            action="/submit"
            method="POST"
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              label="Name"
              name="name"
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Message"
              name="message"
              multiline
              rows={4}
              required
              fullWidth
              variant="outlined"
            />
            <Button type="submit" variant="contained" size="large">
              Send Message
            </Button>
          </Box>
        </Container>
      </Box>
    </main>
  );
};

export default LandingPage;
