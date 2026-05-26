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
  LinearProgress,
  Stack
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  PersonSearch as SearchIcon,
  MedicalServices as ServicesIcon,
  AccountCircle as ProfileIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PatientDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data for UI demonstration
  const user = { name: 'Anastasia', completionRate: 65 };

  const upcomingAppointments = []; // Empty state demo

  const quickActions = [
    {
      title: t('dashboard.patient.browse_services'),
      icon: <ServicesIcon color="primary" />,
      path: '/patient/services'
    },
    {
      title: t('dashboard.patient.find_doctor'),
      icon: <SearchIcon color="secondary" />,
      path: '/patient/doctors'
    },
    {
      title: t('dashboard.patient.my_appointments'),
      icon: <CalendarIcon sx={{ color: '#4caf50' }} />,
      path: '/patient/appointments'
    },
    {
      title: t('sidebar.my_profile'),
      icon: <ProfileIcon sx={{ color: '#ff9800' }} />,
      path: '/patient/profile'
    },
  ];

  const recommendedServices = [
    { id: 1, name: 'General Consultation', department: 'Internal Medicine' },
    { id: 2, name: 'Dental Checkup', department: 'Dentistry' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Welcome Card */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('common.welcome', { name: user.name })}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
            {t('dashboard.patient.welcome_back_text')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/patient/doctors')}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          >
            {t('common.book_now')}
          </Button>
        </Box>
        {/* Decorative circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)'
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            {t('common.quick_actions')}
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: '0.3s',
                    borderRadius: 3,
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 }
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'action.hover', mb: 2, width: 56, height: 56 }}>
                      {action.icon}
                    </Avatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Profile Completion */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <ProfileIcon sx={{ mr: 1, color: 'primary.main' }} />
              {t('dashboard.patient.profile_completion')}
            </Typography>
            <Box sx={{ mt: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {user.completionRate}% {t('common.complete')}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={user.completionRate}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('dashboard.patient.complete_profile_desc')}
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/patient/profile')}
              sx={{ borderRadius: 2 }}
            >
              {t('dashboard.patient.complete_profile')}
            </Button>
          </Paper>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('dashboard.patient.upcoming_appointments')}
              </Typography>
              <Button size="small" endIcon={<ArrowIcon />} onClick={() => navigate('/patient/appointments')}>
                {t('common.view_all')}
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {upcomingAppointments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'action.hover', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                  <InfoIcon color="disabled" sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography color="text.secondary" variant="body1">
                  {t('common.no_upcoming_appointments')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  sx={{ mt: 3, borderRadius: 2 }}
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

        {/* Recommended Services */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('dashboard.patient.recommended_services')}
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {recommendedServices.map((service) => (
                <Grid item xs={12} sm={6} key={service.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                        <CheckIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.department}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Button size="small">{t('common.view_details')}</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboardPage;
