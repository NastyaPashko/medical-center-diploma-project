import React from 'react';
import { Box, Typography, Paper, Grid, Button, Divider } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const ProfileView = ({ profile, onEdit }) => {
  const infoItems = [
    { label: 'Date of Birth', value: profile.date_of_birth || 'Not specified' },
    { label: 'Gender', value: profile.gender || 'Not specified' },
    { label: 'Address', value: profile.address || 'Not specified' },
    { label: 'Insurance Number', value: profile.insurance_number || 'Not specified' },
    { label: 'Emergency Contact Name', value: profile.emergency_contact_name || 'Not specified' },
    { label: 'Emergency Contact Phone', value: profile.emergency_contact_phone || 'Not specified' },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Profile Information
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {infoItems.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {item.label}
            </Typography>
            <Typography variant="body1">
              {item.value}
            </Typography>
            {index < infoItems.length && <Divider sx={{ mt: 1.5, opacity: 0.5 }} />}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Medical Notes
          </Typography>
          <Typography variant="body1">
            {profile.notes || 'No notes available.'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileView;
