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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminServicesPage = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    specialization_id: '',
    price: '',
    duration_minutes: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [srvRes, deptRes, specRes] = await Promise.all([
        adminApi.getServices(),
        adminApi.getDepartments(),
        adminApi.getSpecializations(),
      ]);
      setServices(srvRes.data || []);
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

  const handleOpen = (service = null) => {
    setError(null);
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        department_id: service.department_id,
        specialization_id: service.specialization_id || '',
        price: service.price,
        duration_minutes: service.duration_minutes,
        is_active: !!service.is_active,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        department_id: departments.length > 0 ? departments[0].id : '',
        specialization_id: '',
        price: '',
        duration_minutes: 30,
        is_active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingService(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingService) {
        await adminApi.updateService(editingService.id, formData);
      } else {
        await adminApi.createService(formData);
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
    setServiceToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminApi.deleteService(serviceToDelete);
      fetchData();
      setConfirmOpen(false);
      setServiceToDelete(null);
    } catch {
      setError(t('common.error'));
      setConfirmOpen(false);
    }
  };

  const filteredSpecializations = specializations.filter(
    (spec) => spec.department_id === formData.department_id
  );

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          {t('admin.services.manage')}
        </Typography>
        <Box>
          <IconButton onClick={fetchData} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            disabled={departments.length === 0}
          >
            {t('admin.services.add')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">{t('common.name')}</TableCell>
              <TableCell>{t('common.department')} / {t('common.specialization')}</TableCell>
              <TableCell>{t('admin.services.price')}</TableCell>
              <TableCell>{t('admin.services.duration')}</TableCell>
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
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  {t('admin.services.no_services')}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell fontWeight="medium">
                    <Typography variant="body2" fontWeight="bold">{service.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{service.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{service.department?.name || t('common.not_available')}</Typography>
                    <Typography variant="caption" color="text.secondary">{service.specialization?.name || t('admin.services.all_specializations')}</Typography>
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{t('admin.services.duration_min', { count: service.duration_minutes })}</TableCell>
                  <TableCell>
                    <Alert 
                      severity={service.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {service.is_active ? t('common.active') : t('common.inactive')}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton onClick={() => handleOpen(service)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton onClick={() => handleDeleteClick(service.id)} color="error">
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingService ? t('admin.services.edit') : t('admin.services.add')}
          </DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              name="name"
              label={t('admin.services.name')}
              fullWidth
              required
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="description"
              label={t('admin.departments.description')}
              fullWidth
              multiline
              rows={2}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="dept-label">{t('common.department')}</InputLabel>
              <Select
                labelId="dept-label"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                label={t('common.department')}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="spec-label">{t('common.specialization')} ({t('admin.services.none_general')})</InputLabel>
              <Select
                labelId="spec-label"
                name="specialization_id"
                value={formData.specialization_id}
                onChange={handleChange}
                label={`${t('common.specialization')} (${t('admin.services.none_general')})`}
              >
                <MenuItem value=""><em>{t('admin.services.none_general')}</em></MenuItem>
                {filteredSpecializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="price"
                label={t('admin.services.price')}
                type="number"
                fullWidth
                required
                margin="normal"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                name="duration_minutes"
                label={t('admin.services.duration')}
                type="number"
                fullWidth
                required
                margin="normal"
                value={formData.duration_minutes}
                onChange={handleChange}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={t('admin.departments.is_active')}
              sx={{ mt: 2 }}
            />
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
        message={t('admin.services.confirm_delete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminServicesPage;
