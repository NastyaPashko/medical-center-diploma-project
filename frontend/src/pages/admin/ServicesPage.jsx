import React, { useState, useEffect } from 'react';
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
      setError('Failed to fetch data');
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
      setError(err.response?.data?.message || 'Failed to save service');
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
      setError('Failed to delete service');
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
          Manage Medical Services
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
            Add Service
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Name</TableCell>
              <TableCell>Department / Specialization</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  No services found.
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
                    <Typography variant="body2">{service.department?.name || 'N/A'}</Typography>
                    <Typography variant="caption" color="text.secondary">{service.specialization?.name || 'All specializations'}</Typography>
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>{service.duration_minutes} min</TableCell>
                  <TableCell>
                    <Alert 
                      severity={service.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(service)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
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
            {editingService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              name="name"
              label="Service Name"
              fullWidth
              required
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={2}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Specialization (Optional)</InputLabel>
                <Select
                  name="specialization_id"
                  value={formData.specialization_id}
                  onChange={handleChange}
                  label="Specialization (Optional)"
                >
                  <MenuItem value=""><em>None (General Service)</em></MenuItem>
                  {filteredSpecializations.map((spec) => (
                    <MenuItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="price"
                label="Price"
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
                label="Duration (minutes)"
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
              label="Is Active"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Deactivation"
        message="Are you sure you want to deactivate/delete this medical service?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Deactivate"
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminServicesPage;
