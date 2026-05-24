import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const PlaceholderPage = ({ title }) => {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom sx={{ mb: 3 }}>
        {title}
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Module Under Development
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The {title} functionality will be implemented in the upcoming updates. 
          This module will allow you to manage your medical records and interactions more efficiently.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
