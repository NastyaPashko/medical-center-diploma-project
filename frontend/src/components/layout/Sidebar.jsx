import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Paper,
} from '@mui/material';
import {
  LocalHospital as DoctorIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Sidebar = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  isMobile,
  user,
  navigationItems,
}) => {
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: [2], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DoctorIcon color="primary" />
          MediCare Hub
        </Typography>
      </Toolbar>
      <Divider sx={{ opacity: 0.5 }} />
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={isMobile ? onDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'rgba(0, 121, 107, 0.04)',
                    color: isActive ? 'primary.main' : 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'background.default',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(0, 121, 107, 0.2)'
            }}
          >
            {user?.name?.charAt(0) || <PersonIcon />}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
              {user?.role || 'Patient'}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#fff',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
