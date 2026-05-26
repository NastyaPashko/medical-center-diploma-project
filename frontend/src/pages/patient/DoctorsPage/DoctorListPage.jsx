import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import patientApi from '../../../api/patientApi';

const DoctorListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    name: '',
    department_id: '',
    specialization_id: '',
  });

  const fetchSpecializations = async (deptId) => {
    try {
      const res = await patientApi.getSpecializations({ department_id: deptId });
      setSpecializations(res.data);
    } catch (err) {
      console.error('Failed to fetch specializations', err);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [doctorsRes, deptsRes] = await Promise.all([
        patientApi.getDoctors(),
        patientApi.getDepartments(),
      ]);
      setDoctors(doctorsRes.data);
      setDepartments(deptsRes.data);
      setLoading(false);
    } catch (err) {
      setError(t('common.error') + ': Failed to load doctors.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (filters.department_id) {
      fetchSpecializations(filters.department_id);
    } else {
      setSpecializations([]);
    }
  }, [filters.department_id]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'department_id' ? { specialization_id: '' } : {}),
    }));
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await patientApi.getDoctors(filters);
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      setError(t('common.error') + ': Failed to filter doctors.');
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      department_id: '',
      specialization_id: '',
    });
    fetchInitialData();
  };

  if (loading && doctors.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom sx={{ mb: 3 }}>
        {t('doctor.find_doctors')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label={t('doctor.search_by_name')}
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('common.department')}</InputLabel>
              <Select
                name="department_id"
                value={filters.department_id}
                label={t('common.department')}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t('doctor.all_departments')}</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small" disabled={!filters.department_id}>
              <InputLabel>{t('common.specialization')}</InputLabel>
              <Select
                name="specialization_id"
                value={filters.specialization_id}
                label={t('common.specialization')}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t('doctor.all_specializations')}</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSearch} fullWidth>
              {t('common.search')}
            </Button>
            <Button variant="outlined" onClick={handleClearFilters} fullWidth>
              {t('common.clear')}
            </Button>
          </Grid>
        </Grid>
      </Card>

      {doctors.length === 0 ? (
        <Paper sx={{ py: 10, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {t('doctor.no_doctors_found')}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
              >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={doctor.user?.avatar_url} 
                    sx={{ width: 80, height: 80, border: '2px solid', borderColor: 'primary.light' }}
                  >
                    {doctor.user?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {doctor.user?.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="500">
                      {doctor.specialization?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doctor.department?.name}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 2,
                    height: '4.5em'
                  }}>
                    {doctor.bio || t('doctor.no_bio')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="subtitle2" color="primary.main">
                      {t('doctor.experience_years', { years: doctor.experience_years })}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      ${doctor.consultation_price}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button variant="outlined" fullWidth onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/patient/doctors/${doctor.id}`);
                  }}>
                    {t('doctor.view_details')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DoctorListPage;
