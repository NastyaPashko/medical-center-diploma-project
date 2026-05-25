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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import patientApi from '../../../api/patientApi';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        setError('Failed to load doctor details.');
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
          Back to list
        </Button>
        <Alert severity="error">{error || 'Doctor not found.'}</Alert>
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
        Back to search
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
                  <Typography variant="caption" color="text.secondary" display="block">Experience</Typography>
                  <Typography variant="body2" fontWeight="500">{doctor.experience_years} Years</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MeetingRoomIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Office</Typography>
                  <Typography variant="body2" fontWeight="500">{doctor.office_number || 'N/A'}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocalHospitalIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Consultation Price</Typography>
                  <Typography variant="body2" fontWeight="600" color="primary.main">${doctor.consultation_price}</Typography>
                </Box>
              </Box>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Button variant="contained" fullWidth size="large" disabled>
                Book Appointment (Soon)
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Info Content */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Biography
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {doctor.bio || 'No biography available for this doctor.'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SchoolIcon /> Education
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {doctor.education || 'No education details provided.'}
              </Typography>
            </Paper>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Specialization Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Main Specialization</Typography>
                  <Typography variant="body1">{doctor.specialization?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Medical Department</Typography>
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
