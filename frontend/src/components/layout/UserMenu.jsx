import React from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material';
import {
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, anchorEl, onClose, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={Boolean(anchorEl)}
      onClose={onClose}
      onClick={onClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 180,
          '& .MuiAvatar-root': {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem onClick={() => navigate(`/${user?.role?.toLowerCase()}/profile`)}>
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem onClick={onLogout} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
