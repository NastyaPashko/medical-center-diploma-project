import React from 'react';
import { Box, Typography, Avatar, Paper, Grid, Divider } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={user.avatar_url}
          sx={{
            width: 100,
            height: 100,
            bgcolor: 'primary.main',
            fontSize: '3rem',
            border: '3px solid white',
            boxShadow: 2
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              mt: 1,
              px: 1.5,
              py: 0.5,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 1,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}
          >
            Patient
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
