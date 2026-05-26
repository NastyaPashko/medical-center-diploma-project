import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminDoctorsPage = () => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    department_id: '',
    specialization_id: '',
    bio: '',
    experience_years: '',
    education: '',
    office_number: '',
    consultation_price: '',
    is_available: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docRes, deptRes, specRes] = await Promise.all([
        adminApi.getDoctors(),
        adminApi.getDepartments(),
        adminApi.getSpecializations(),
      ]);
      setDoctors(docRes.data || []);
      setDepartments(deptRes.data || []);
      setSpecializations(specRes.data || []);
      setError(null);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (doctor = null) => {
    setError(null);
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        user_id: doctor.user_id,
        name: doctor.user?.name || '',
        email: doctor.user?.email || '',
        phone: doctor.user?.phone || '',
        password: '',
        department_id: doctor.department_id || '',
        specialization_id: doctor.specialization_id || '',
        bio: doctor.bio || '',
        experience_years: doctor.experience_years || '',
        education: doctor.education || '',
        office_number: doctor.office_number || '',
        consultation_price: doctor.consultation_price || '',
        is_available: !!doctor.is_available,
      });
    } else {
      setEditingDoctor(null);
      setFormData({
        user_id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        department_id: '',
        specialization_id: '',
        bio: '',
        experience_years: '',
        education: '',
        office_number: '',
        consultation_price: '',
        is_available: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDoctor(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      // Reset specialization if department changes
      if (name === 'department_id') {
        newData.specialization_id = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingDoctor) {
        await adminApi.updateDoctor(editingDoctor.id, formData);
      } else {
        // In a real app, we'd need a user list to pick from
        // For now, assuming we're editing existing profiles or the API handles it
        await adminApi.createDoctor(formData);
      }
      handleClose();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDoctorToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminApi.deleteDoctor(doctorToDelete);
      fetchData();
      setConfirmOpen(false);
      setDoctorToDelete(null);
    } catch {
      setError(t('common.error'));
      setConfirmOpen(false);
    }
  };

  const filteredSpecializations = specializations.filter((spec) => {
    const matchesDept = String(spec.department_id) === String(formData.department_id);
    return matchesDept && spec.is_active;
  });

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          {t('doctor.manage_doctors')}
        </Typography>
        <Box>
          <IconButton onClick={fetchData} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2 }}
          >
            {t('doctor.add_doctor')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">{t('sidebar.doctors')}</TableCell>
              <TableCell>{t('common.specialization')}</TableCell>
              <TableCell>{t('doctor.experience')}</TableCell>
              <TableCell>{t('doctor.price')}</TableCell>
              <TableCell>{t('common.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  {t('common.no_doctors_found')}
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {doctor.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doctor.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{doctor.specialization?.name || t('common.not_available')}</Typography>
                    <Typography variant="caption" color="text.secondary">{doctor.department?.name}</Typography>
                  </TableCell>
                  <TableCell>{t('doctor.experience_years', { years: doctor.experience_years })}</TableCell>
                  <TableCell>${doctor.consultation_price}</TableCell>
                  <TableCell>
                    <Alert 
                      severity={doctor.is_available ? "success" : "warning"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {doctor.is_available ? t('doctor.available') : t('doctor.unavailable')}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton onClick={() => handleOpen(doctor)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton onClick={() => handleDeleteClick(doctor.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingDoctor ? `${t('common.edit')}: ${editingDoctor.user?.name}` : t('doctor.add_doctor')}
          </DialogTitle>
          <DialogContent dividers sx={{ pt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="name"
                  label={t('doctor.doctor_name')}
                  fullWidth
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!!editingDoctor}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="email"
                  label={t('auth.email')}
                  type="email"
                  fullWidth
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!!editingDoctor}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="phone"
                  label={t('auth.phone')}
                  fullWidth
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!!editingDoctor}
                />
              </Grid>
              {!editingDoctor && (
                <Grid item xs={12} md={6}>
                  <TextField
                    name="password"
                    label={t('doctor.initial_password')}
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('doctor.password_hint')}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="department-select-label">{t('doctor.select_department')}</InputLabel>
                  <Select
                    labelId="department-select-label"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    label={t('doctor.select_department')}
                    MenuProps={{ 
                      PaperProps: { 
                        sx: { maxHeight: 300 } 
                      },
                      disablePortal: true 
                    }}
                  >
                    {departments.filter(d => d.is_active).map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required disabled={!formData.department_id}>
                  <InputLabel id="specialization-select-label">{t('doctor.select_specialization')}</InputLabel>
                  <Select
                    labelId="specialization-select-label"
                    name="specialization_id"
                    value={formData.specialization_id}
                    onChange={handleChange}
                    label={t('doctor.select_specialization')}
                    MenuProps={{ 
                      PaperProps: { 
                        sx: { maxHeight: 300 } 
                      },
                      disablePortal: true
                    }}
                  >
                    {filteredSpecializations.length === 0 ? (
                      <MenuItem disabled value="">
                        {formData.department_id ? t('doctor.no_specializations') : t('doctor.select_dept_first')}
                      </MenuItem>
                    ) : (
                      filteredSpecializations.map((spec) => (
                        <MenuItem key={spec.id} value={spec.id}>
                          {spec.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="experience_years"
                  label={t('doctor.experience_years_label')}
                  type="number"
                  fullWidth
                  value={formData.experience_years}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 60 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="consultation_price"
                  label={t('doctor.consultation_price_label')}
                  type="number"
                  fullWidth
                  required
                  value={formData.consultation_price}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 100000, step: "0.01" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="education"
                  label={t('doctor.education')}
                  fullWidth
                  value={formData.education}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="office_number"
                  label={t('doctor.office')}
                  fullWidth
                  value={formData.office_number}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="bio"
                  label={t('doctor.bio')}
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={t('doctor.is_available_label')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('common.cancel')}</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? t('common.loading') : t('common.save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title={t('common.delete')}
        message={t('doctor.confirm_delete_doctor')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminDoctorsPage;
