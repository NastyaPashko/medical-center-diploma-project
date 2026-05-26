import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Snackbar,
  Divider
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import doctorApi from '../../api/doctorApi';

const DoctorProfilePage = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    experience_years: '',
    education: '',
    office_number: '',
    consultation_price: '',
    is_available: true,
    avatar: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await doctorApi.getProfile();
      const data = response.data;
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        experience_years: data.experience_years || '',
        education: data.education || '',
        office_number: data.office_number || '',
        consultation_price: data.consultation_price || '',
        is_available: data.is_available ?? true,
        avatar: null
      });
      setPreviewUrl(data.avatar_url || '');
      setError(null);
    } catch (err) {
      setError(t('errors.fetchProfileFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'avatar') {
          if (formData[key]) {
            data.append(key, formData[key]);
          }
        } else if (key === 'is_available') {
          data.append(key, formData[key] ? '1' : '0');
        } else {
          data.append(key, formData[key]);
        }
      });

      await doctorApi.updateProfile(data);
      setSuccess(true);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      setError(err.response?.data?.message || t('errors.updateProfileFailed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('doctor.profile.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('doctor.profile.subtitle')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Sidebar Info */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 120, height: 120, border: '3px solid', borderColor: 'primary.main' }}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  onClick={() => fileInputRef.current.click()}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'background.paper',
                    boxShadow: 2,
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Box>

              <Typography variant="h6" fontWeight="bold">
                {profile?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile?.specialization?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                {profile?.department?.name}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.is_available}
                    onChange={handleChange}
                    name="is_available"
                    color="primary"
                  />
                }
                label={t('doctor.profile.availableForBooking')}
              />
            </Paper>
          </Grid>

          {/* Form Fields */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <InfoIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('doctor.profile.bio')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder={t('doctor.profile.bioPlaceholder')}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('doctor.profile.experienceYears')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('doctor.profile.officeNumber')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    name="office_number"
                    value={formData.office_number}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('doctor.profile.education')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {t('doctor.profile.consultationPrice')}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    type="number"
                    name="consultation_price"
                    value={formData.consultation_price}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: <Typography variant="body2" color="text.secondary">₴</Typography>
                    }}
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{ minWidth: 200 }}
                  >
                    {t('common.save_changes')}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={t('doctor.profile.updateSuccess')}
      />
    </Container>
  );
};

export default DoctorProfilePage;
