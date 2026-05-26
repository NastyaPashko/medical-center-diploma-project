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
  Chip,
  IconButton
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  People as PatientsIcon, 
  Assignment as NotesIcon, 
  Schedule as ScheduleIcon,
  TrendingUp as StatsIcon,
  MoreVert as MoreIcon,
  ArrowForward as ArrowIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DoctorDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data for UI demonstration
  const user = { name: 'Dr. Smith' };
  
  const stats = [
    { title: t('dashboard.doctor.active_patients'), value: '42', icon: <PatientsIcon color="primary" />, color: 'primary.light' },
    { title: t('dashboard.doctor.todays_schedule'), value: '8', icon: <ScheduleIcon color="secondary" />, color: 'secondary.light' },
    { title: t('dashboard.doctor.pending_notes'), value: '3', icon: <NotesIcon color="error" />, color: 'error.light' },
  ];

  const quickActions = [
    { title: t('dashboard.doctor.manage_schedule'), icon: <ScheduleIcon />, path: '/doctor/schedule', color: '#4caf50' },
    { title: t('common.profile'), icon: <ProfileIcon />, path: '/doctor/profile', color: '#2196f3' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {t('common.welcome', { name: user.name })}
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Widgets */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
              <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 56, height: 56 }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {t('common.quick_actions')}
            </Typography>
            <List>
              {quickActions.map((action, index) => (
                <ListItem 
                  key={index} 
                  disableGutters 
                  secondaryAction={
                    <IconButton edge="end" onClick={() => navigate(action.path)}>
                      <ArrowIcon />
                    </IconButton>
                  }
                  sx={{ mb: 1 }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: action.color, color: 'white' }}>
                      {action.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={action.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Today's Schedule Placeholder */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1 }} />
                {t('dashboard.doctor.todays_schedule')}
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/doctor/schedule')}>
                {t('common.view_all')}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {t('common.no_data')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {t('common.coming_soon')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Patient Statistics Chart Placeholder */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <StatsIcon sx={{ mr: 1, color: 'primary.main' }} />
              {t('dashboard.doctor.patient_statistics')}
            </Typography>
            <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Chart Visualization Placeholder
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity Placeholder */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.doctor.recent_activity')}
            </Typography>
            <Box sx={{ py: 2 }}>
              <Chip label={t('common.under_development')} variant="outlined" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboardPage;
