import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  IconButton
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ProfileForm = ({ profile, onSave, onCancel, loading, error }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    date_of_birth: profile.date_of_birth || '',
    gender: profile.gender || '',
    address: profile.address || '',
    insurance_number: profile.insurance_number || '',
    emergency_contact_name: profile.emergency_contact_name || '',
    emergency_contact_phone: profile.emergency_contact_phone || '',
    notes: profile.notes || '',
    avatar: null,
  });

  const [previewUrl, setPreviewUrl] = useState(profile.avatar_url || '');

  // Update preview if profile changes (e.g. after successful save)
  React.useEffect(() => {
    setPreviewUrl(profile.avatar_url || '');
  }, [profile.avatar_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        {t('common.profile')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={previewUrl}
                sx={{ width: 100, height: 100, mb: 1, border: '2px solid', borderColor: 'divider' }}
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
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                  boxShadow: 1
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </Box>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <Typography variant="caption" color="text.secondary">
              {t('admin.patients.profile_photo')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('admin.patients.date_of_birth')}
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label={t('admin.patients.gender')}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              SelectProps={{
                displayEmpty: true,
              }}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="" disabled>{t('admin.patients.gender')}</MenuItem>
              <MenuItem value="male">{t('roles.patient')} (M)</MenuItem>
              <MenuItem value="female">{t('roles.patient')} (F)</MenuItem>
              <MenuItem value="other">{t('common.placeholder_text', { title: '' })}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('admin.patients.address')}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={t('admin.patients.address')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('admin.patients.insurance')}
              name="insurance_number"
              value={formData.insurance_number}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('admin.patients.emergency_contact')}
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('admin.patients.emergency_phone')}
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label={t('admin.patients.medical_notes')}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t('admin.patients.medical_notes')}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2, mb: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {t('common.save_changes')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProfileForm;
