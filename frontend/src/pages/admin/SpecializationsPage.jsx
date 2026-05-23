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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';

const AdminSpecializationsPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
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
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (spec = null) => {
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
      setError(err.response?.data?.message || 'Failed to save specialization');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate/delete this specialization?')) {
      try {
        await adminApi.deleteSpecialization(id);
        fetchData();
      } catch {
        setError('Failed to delete specialization');
      }
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          Manage Specializations
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
            Add Specialization
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {departments.length === 0 && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You need to create at least one department before adding specializations.
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  No specializations found.
                </TableCell>
              </TableRow>
            ) : (
              specializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell fontWeight="medium">{spec.name}</TableCell>
                  <TableCell>{spec.department?.name || 'N/A'}</TableCell>
                  <TableCell>{spec.description}</TableCell>
                  <TableCell>
                    <Alert 
                      severity={spec.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {spec.is_active ? 'Active' : 'Inactive'}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(spec)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(spec.id)} color="error">
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
            {editingSpec ? 'Edit Specialization' : 'Add New Specialization'}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              name="name"
              label="Specialization Name"
              fullWidth
              required
              margin="normal"
              value={formData.name}
              onChange={handleChange}
            />
            
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

            <TextField
              name="description"
              label="Description"
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
    </Box>
  );
};

export default AdminSpecializationsPage;
