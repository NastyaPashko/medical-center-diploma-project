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
  Chip
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon, 
  PersonSearch as SearchIcon, 
  Healing as SymptomIcon, 
  Description as PrescriptionIcon,
  Favorite as HealthIcon,
  Notifications as NotificationIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PatientDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data for UI demonstration
  const user = { name: 'Anastasia' };
  
  const upcomingAppointments = []; // Empty state demo

  const quickActions = [
    { title: t('dashboard.patient.find_doctor'), icon: <SearchIcon color="primary" />, path: '/patient/doctors' },
    { title: t('dashboard.patient.symptom_checker'), icon: <SymptomIcon color="secondary" />, path: '/patient/symptoms' },
    { title: t('dashboard.patient.my_prescriptions'), icon: <PrescriptionIcon sx={{ color: '#4caf50' }} />, path: '#' },
  ];

  const healthTips = [
    { id: 1, text: 'Stay hydrated: Drink at least 8 glasses of water a day.' },
    { id: 2, text: 'Remember to take your vitamins after breakfast.' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        {t('common.welcome', { name: user.name })}
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {t('common.quick_actions')}
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: '0.3s', 
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 3 } 
                  }}
                  onClick={() => action.path !== '#' && navigate(action.path)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'background.paper', mr: 2, boxShadow: 1 }}>
                      {action.icon}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1 }} />
                {t('dashboard.patient.upcoming_appointments')}
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />}>
                {t('common.view_all')}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  {t('common.no_upcoming_appointments')}
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<CalendarIcon />} 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/patient/doctors')}
                >
                  {t('common.book_now')}
                </Button>
              </Box>
            ) : (
              <List>
                {/* Real items would go here */}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Health Tips & Notifications */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <HealthIcon sx={{ mr: 1 }} />
                  {t('dashboard.patient.health_tips')}
                </Typography>
                <List dense>
                  {healthTips.map(tip => (
                    <ListItem key={tip.id} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <ArrowIcon sx={{ fontSize: 'small', color: 'inherit' }} />
                      </ListItemIcon>
                      <ListItemText primary={tip.text} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <NotificationIcon sx={{ mr: 1, color: 'orange' }} />
                  {t('common.coming_soon')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('common.placeholder_text', { title: t('sidebar.payments') })}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Medical History Placeholder */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.patient.medical_history')}
            </Typography>
            <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
              <Chip label={t('common.under_development')} variant="outlined" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboardPage;
