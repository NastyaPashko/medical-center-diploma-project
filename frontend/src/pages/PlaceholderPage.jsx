import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';

const PlaceholderPage = ({ title }) => {
  return (
    <DashboardLayout>
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
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
            mt: 2
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
    </DashboardLayout>
  );
};

export default PlaceholderPage;
