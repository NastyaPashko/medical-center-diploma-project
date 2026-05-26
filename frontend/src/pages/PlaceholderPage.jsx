import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Paper, Box } from '@mui/material';

const PlaceholderPage = ({ title }) => {
  const { t } = useTranslation();
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
          {t('common.under_development')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('common.placeholder_text', { title })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlaceholderPage;
