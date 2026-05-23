import React, { useState } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Container,
  Toolbar,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UserMenu from './UserMenu';
import { navigationItemsByRole } from './navigationConfig.jsx';

const drawerWidth = 280;

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const role = user?.role?.toLowerCase() || 'patient';
  const navigationItems = navigationItemsByRole[role] || navigationItemsByRole.patient;
  const pageTitle = navigationItems.find(item => item.path === location.pathname)?.text || 'Dashboard';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Topbar
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        user={user}
        onMenuOpen={handleMenuOpen}
        pageTitle={pageTitle}
      />

      <UserMenu
        user={user}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onLogout={handleLogout}
      />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        isMobile={isMobile}
        user={user}
        navigationItems={navigationItems}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
