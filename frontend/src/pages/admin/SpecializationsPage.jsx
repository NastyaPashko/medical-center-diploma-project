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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminSpecializationsPage = () => {
  const { t } = useTranslation();
  const [specializations, setSpecializations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [specToDelete, setSpecToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [specRes, deptRes] = await Promise.all([
        adminApi.getSpecializations(),
        adminApi.getDepartments(),
      ]);
      setSpecializations(specRes.data || []);
      setDepartments(deptRes.data || []);
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

  const handleOpen = (spec = null) => {
    setError(null);
    if (spec) {
      setEditingSpec(spec);
      setFormData({
        name: spec.name,
        description: spec.description || '',
        department_id: spec.department_id,
        is_active: !!spec.is_active,
      });
    } else {
      setEditingSpec(null);
      setFormData({
        name: '',
        description: '',
        department_id: departments.length > 0 ? departments[0].id : '',
        is_active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSpec(null);
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
      if (editingSpec) {
        await adminApi.updateSpecialization(editingSpec.id, formData);
      } else {
        await adminApi.createSpecialization(formData);
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
    setSpecToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminApi.deleteSpecialization(specToDelete);
      fetchData();
      setConfirmOpen(false);
      setSpecToDelete(null);
    } catch {
      setError(t('common.error'));
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          {t('admin.specializations.manage')}
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
            {t('admin.specializations.add')}
          </Button>
        </Box>
      </Box>

      {departments.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('doctor.select_dept_first')}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">{t('common.name')}</TableCell>
              <TableCell>{t('common.department')}</TableCell>
              <TableCell>{t('admin.departments.description')}</TableCell>
              <TableCell>{t('common.status')}</TableCell>
              <TableCell align="right">{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : specializations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  {t('admin.specializations.no_specializations')}
                </TableCell>
              </TableRow>
            ) : (
              specializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell fontWeight="medium">{spec.name}</TableCell>
                  <TableCell>{spec.department?.name || t('common.not_available')}</TableCell>
                  <TableCell>{spec.description}</TableCell>
                  <TableCell>
                    <Alert 
                      severity={spec.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {spec.is_active ? t('common.active') : t('common.inactive')}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton onClick={() => handleOpen(spec)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton onClick={() => handleDeleteClick(spec.id)} color="error">
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
            {editingSpec ? t('admin.specializations.edit') : t('admin.specializations.add')}
          </DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              name="name"
              label={t('admin.specializations.name')}
              fullWidth
              required
              margin="normal"
              value={formData.name}
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

            <TextField
              name="description"
              label={t('admin.departments.description')}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
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
        message={t('admin.specializations.confirm_delete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminSpecializationsPage;
