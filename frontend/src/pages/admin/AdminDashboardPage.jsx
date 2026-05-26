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
  Chip,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Business as DeptIcon,
  CalendarMonth as AppointmentIcon,
  MedicalServices as ServiceIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingIcon,
  History as HistoryIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Assessment as AnalyticsIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const overviewStats = [
    {
      title: t('dashboard.admin.total_doctors'),
      value: '24',
      icon: <DoctorIcon />,
      color: '#2196f3',
      path: '/admin/doctors',
      trend: '+2'
    },
    {
      title: t('dashboard.admin.total_patients'),
      value: '156',
      icon: <PeopleIcon />,
      color: '#4caf50',
      path: '/admin/patients',
      trend: '+12'
    },
    {
      title: t('dashboard.admin.active_departments'),
      value: '8',
      icon: <DeptIcon />,
      color: '#ff9800',
      path: '/admin/departments',
      trend: '0'
    },
    {
      title: t('dashboard.admin.total_services'),
      value: '42',
      icon: <ServiceIcon />,
      color: '#9c27b0',
      path: '/admin/services',
      trend: '+5'
    },
  ];

  const quickActions = [
    {
      title: t('dashboard.admin.manage_doctors'),
      icon: <DoctorIcon />,
      path: '/admin/doctors',
      color: '#2196f3'
    },
    {
      title: t('dashboard.admin.manage_patients'),
      icon: <PeopleIcon />,
      path: '/admin/patients',
      color: '#4caf50'
    },
    {
      title: t('dashboard.admin.manage_services'),
      icon: <ServiceIcon />,
      path: '/admin/services',
      color: '#9c27b0'
    },
    {
      title: t('dashboard.admin.manage_schedules'),
      icon: <AppointmentIcon />,
      path: '/admin/schedules',
      color: '#f44336'
    },
  ];

  const recentActivities = [
    {
      text: t('dashboard.admin.activity_user_registered', { name: 'John Doe' }),
      time: '2 hours ago',
      icon: <PersonAddIcon color="primary" />
    },
    {
      text: t('dashboard.admin.activity_doctor_added', { name: 'Dr. Smith' }),
      time: '5 hours ago',
      icon: <DoctorIcon color="success" />
    },
    {
      text: t('dashboard.admin.activity_dept_updated', { name: 'Cardiology' }),
      time: 'Yesterday',
      icon: <EditIcon color="warning" />
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, md: 2 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('dashboard.admin.platform_overview')}
        </Typography>
        <Chip
          label={t('dashboard.admin.system_status') + ": Healthy"}
          color="success"
          variant="outlined"
          onDelete={() => {}}
          deleteIcon={<TrendingIcon />}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        {overviewStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  {stat.trend !== '0' && (
                    <Chip
                      label={stat.trend}
                      size="small"
                      color="success"
                      variant="soft"
                      sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#e8f5e9', color: '#2e7d32' }}
                    />
                  )}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <TrendingIcon sx={{ mr: 1, color: 'primary.main' }} />
              {t('common.quick_actions')}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => navigate(action.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: action.color,
                        bgcolor: `${action.color}05`
                      }
                    }}
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('dashboard.admin.recent_activity')}
              </Typography>
              <Button size="small">{t('dashboard.admin.view_all_activity')}</Button>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <List disablePadding>
              {recentActivities.map((activity, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    py: 1.5,
                    borderBottom: index < recentActivities.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'transparent' }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.text}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Analytics Preview Placeholder */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <AnalyticsIcon sx={{ mr: 1, color: 'primary.main' }} />
                {t('dashboard.admin.analytics_preview')}
              </Typography>
              <Button variant="contained" startIcon={<AnalyticsIcon />} size="small">
                {t('dashboard.admin.generate_report')}
              </Button>
            </Box>
            <Box
              sx={{
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <AnalyticsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary" variant="body2">
                {t('common.under_development')}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Real-time charts and data visualization coming soon
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
