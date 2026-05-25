import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Avatar,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Topbar = ({ drawerWidth, onDrawerToggle, user, onMenuOpen, pageTitle }) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        backgroundColor: '#fff',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {pageTitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Account settings">
            <IconButton
              onClick={onMenuOpen}
              size="small"
              sx={{ ml: 2 }}
            >
              <Avatar 
                src={user?.avatar_url}
                sx={{ 
                  width: 35, 
                  height: 35, 
                  bgcolor: 'primary.main',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
