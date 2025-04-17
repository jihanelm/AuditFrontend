import React from 'react';
import { Box, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f1f1f1',
        py: 2,
        px: 1,
        mt: 4,
        textAlign: 'center',
      }}
    >
      <Stack direction="row" spacing={2} justifyContent="center" mb={1}>
        <IconButton
          component="a"
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <Facebook />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <Twitter />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <Instagram />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedIn />
        </IconButton>
      </Stack>
      <Typography variant="body2" color="textSecondary">
        © 2025 Groupe Crédit Agricole du Maroc
      </Typography>
    </Box>
  );
};

export default Footer;
