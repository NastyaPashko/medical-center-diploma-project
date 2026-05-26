import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip
} from '@mui/material';
import { 
  People as PeopleIcon, 
  LocalHospital as DoctorIcon, 
  Business as DeptIcon, 
  CalendarMonth as AppointmentIcon,
  Settings as SettingsIcon,
  Storage as SystemIcon,
  ArrowForward as ArrowIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const summary = [
    { title: t('dashboard.admin.total_doctors'), value: '24', icon: <DoctorIcon />, color: '#2196f3', path: '/admin/doctors' },
    { title: t('dashboard.admin.total_patients'), value: '156', icon: <PeopleIcon />, color: '#4caf50', path: '/admin/patients' },
    { title: t('dashboard.admin.active_departments'), value: '8', icon: <DeptIcon />, color: '#ff9800', path: '/admin/departments' },
    { title: t('dashboard.admin.daily_appointments'), value: '32', icon: <AppointmentIcon />, color: '#f44336', path: '/admin/schedules' },
  ];

  const manageLinks = [
    { title: t('sidebar.specializations'), icon: <SettingsIcon />, path: '/admin/specializations' },
    { title: t('sidebar.services'), icon: <ReportIcon />, path: '/admin/services' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {t('dashboard.admin.platform_overview')}
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        {summary.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: item.color, width: 48, height: 48 }}>
                    {item.icon}
                  </Avatar>
                  <Chip label="+5%" size="small" color="success" variant="outlined" />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Quick Management */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.admin.user_management')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {manageLinks.map((link, index) => (
                <ListItem 
                  key={index} 
                  disableGutters
                  secondaryAction={
                    <IconButton edge="end" onClick={() => navigate(link.path)}>
                      <ArrowIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
                      {link.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={link.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* System Status Placeholder */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <SystemIcon sx={{ mr: 1 }} />
                {t('dashboard.admin.system_status')}
              </Typography>
              <Chip label="Healthy" color="success" size="small" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                All systems operational
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last checked: Just now
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Analytics Placeholder */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('sidebar.statistics')}
            </Typography>
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {t('common.under_development')}
              </Typography>
              <Button sx={{ mt: 2 }}>
                Generate Monthly Report
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
