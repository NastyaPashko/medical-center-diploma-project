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
      setError('Failed to fetch departments');
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
      setError(err.response?.data?.message || 'Failed to save department');
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
      setError('Failed to delete department');
      setConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          Manage Departments
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
            Add Department
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell fontWeight="bold">Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Location</TableCell>
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
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No departments found.
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell fontWeight="medium">{dept.name}</TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>{dept.phone}</TableCell>
                  <TableCell>
                    {dept.floor && `Floor ${dept.floor}`}
                    {dept.floor && dept.room_number && ', '}
                    {dept.room_number && `Room ${dept.room_number}`}
                  </TableCell>
                  <TableCell>
                    <Alert 
                      severity={dept.is_active ? "success" : "error"} 
                      icon={false}
                      sx={{ py: 0, px: 1, display: 'inline-flex' }}
                    >
                      {dept.is_active ? 'Active' : 'Inactive'}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(dept)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
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
            {editingDept ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              name="name"
              label="Department Name"
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
              rows={3}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                name="floor"
                label="Floor"
                fullWidth
                margin="normal"
                value={formData.floor}
                onChange={handleChange}
              />
            </Box>
            <TextField
              name="room_number"
              label="Room Number"
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
        message="Are you sure you want to deactivate/delete this department? This may affect linked specializations and services."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText="Deactivate"
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminDepartmentsPage;
