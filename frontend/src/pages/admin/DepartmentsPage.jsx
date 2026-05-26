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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const AdminDepartmentsPage = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    floor: '',
    room_number: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getDepartments();
      setDepartments(response.data || []);
      setError(null);
    } catch (err) {
      setError(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpen = (dept = null) => {
    setError(null);
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        description: dept.description || '',
        phone: dept.phone || '',
        floor: dept.floor || '',
        room_number: dept.room_number || '',
        is_active: !!dept.is_active,
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        description: '',
        phone: '',
        floor: '',
        room_number: '',
        is_active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingDept(null);
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
      if (editingDept) {
        await adminApi.updateDepartment(editingDept.id, formData);
      } else {
        await adminApi.createDepartment(formData);
      }
      handleClose();
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeptToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await adminApi.deleteDepartment(deptToDelete);
      fetchDepartments();
      setConfirmOpen(false);
      setDeptToDelete(null);
    } catch {
      setError(t('common.error'));
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          {t('admin.departments.manage')}
        </Typography>
        <Box>
          <IconButton onClick={fetchDepartments} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            {t('admin.departments.add')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">{t('common.name')}</TableCell>
              <TableCell>{t('admin.departments.description')}</TableCell>
              <TableCell>{t('admin.departments.phone')}</TableCell>
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
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  {t('admin.departments.no_departments')}
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell fontWeight="medium">{dept.name}</TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>{dept.phone}</TableCell>
                  <TableCell>
                    <Alert 
                      severity={dept.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {dept.is_active ? t('common.active') : t('common.inactive')}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('common.edit')}>
                      <IconButton onClick={() => handleOpen(dept)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('common.delete')}>
                      <IconButton onClick={() => handleDeleteClick(dept.id)} color="error">
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
            {editingDept ? t('admin.departments.edit') : t('admin.departments.add')}
          </DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              name="name"
              label={t('admin.departments.name')}
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
              rows={3}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="phone"
                label={t('admin.departments.phone')}
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                name="floor"
                label={t('admin.departments.floor')}
                fullWidth
                margin="normal"
                value={formData.floor}
                onChange={handleChange}
              />
            </Box>
            <TextField
              name="room_number"
              label={t('admin.departments.room')}
              fullWidth
              margin="normal"
              value={formData.room_number}
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
        message={t('admin.departments.confirm_delete')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText={t('common.delete')}
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminDepartmentsPage;
