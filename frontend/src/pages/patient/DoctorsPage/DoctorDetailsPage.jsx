import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Paper,
  Stack,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import patientApi from '../../../api/patientApi';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await patientApi.getDoctorById(id);
        setDoctor(res.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error') + ': Failed to load doctor details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/patient/doctors')} sx={{ mb: 2 }}>
          {t('common.back_to_list')}
        </Button>
        <Alert severity="error">{error || t('common.doctor_not_found')}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/patient/doctors')} 
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        {t('common.back_to_search')}
      </Button>

      <Grid container spacing={3}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Avatar
              src={doctor.user?.avatar_url}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2, border: '4px solid', borderColor: 'primary.light' }}
            >
              {doctor.user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {doctor.user?.name}
            </Typography>
            <Typography variant="subtitle1" color="primary" fontWeight="600" gutterBottom>
              {doctor.specialization?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              {doctor.department?.name}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2} textAlign="left">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <WorkIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('doctor.experience')}</Typography>
                  <Typography variant="body2" fontWeight="500">{t('doctor.experience_years', { years: doctor.experience_years })}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MeetingRoomIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('doctor.office')}</Typography>
                  <Typography variant="body2" fontWeight="500">{doctor.office_number || t('common.not_available')}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalHospitalIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">{t('doctor.price')}</Typography>
                  <Typography variant="body2" fontWeight="600" color="primary.main">${doctor.consultation_price}</Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" fullWidth size="large" disabled>
                {t('common.book_appointment')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Info Content */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('doctor.bio')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {doctor.bio || t('doctor.no_bio')}
              </Typography>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon /> {t('doctor.education')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {doctor.education || 'N/A'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('common.specialization_details')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">{t('common.main_specialization')}</Typography>
                  <Typography variant="body1">{doctor.specialization?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">{t('common.medical_department')}</Typography>
                  <Typography variant="body1">{doctor.department?.name}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDetailsPage;
