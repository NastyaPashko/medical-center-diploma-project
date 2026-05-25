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
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import adminApi from '../../api/adminApi';

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    insurance_number: '',
    notes: '',
    avatar: null,
  });
  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPatients();
      setPatients(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenEdit = (patient) => {
    setError(null);
    setSelectedPatient(patient);
    setFormData({
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || '',
      address: patient.address || '',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
      insurance_number: patient.insurance_number || '',
      notes: patient.notes || '',
      avatar: null,
    });
    setPreviewUrl(patient.avatar_url || '');
    setOpen(true);
  };

  const handleOpenView = (patient) => {
    setSelectedPatient(patient);
    setViewOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
    setSelectedPatient(null);
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setSubmitting(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          dataToSend.append(key, formData[key]);
        }
      });
      dataToSend.append('_method', 'PUT');

      await adminApi.updatePatient(selectedPatient.id, dataToSend);
      handleClose();
      fetchPatients();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update patient profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="700" color="text.primary">
          Manage Patients
        </Typography>
        <IconButton onClick={fetchPatients}>
          <RefreshIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ pl: 2 }}></TableCell>
              <TableCell fontWeight="bold">Patient</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Insurance</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No patients found.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell sx={{ pl: 2 }}>
                    <Avatar 
                      src={patient.avatar_url} 
                      sx={{ width: 40, height: 40 }}
                    >
                      {patient.user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {patient.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.user?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {patient.user?.phone || 'N/A'}
                  </TableCell>
                  <TableCell>{patient.insurance_number || 'N/A'}</TableCell>
                  <TableCell>{patient.gender ? (patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)) : 'N/A'}</TableCell>
                  <TableCell>
                    {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleOpenView(patient)} color="info">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Profile">
                      <IconButton onClick={() => handleOpenEdit(patient)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent dividers>
          {selectedPatient && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar 
                  src={selectedPatient.avatar_url} 
                  sx={{ width: 64, height: 64 }}
                >
                  {selectedPatient.user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1.2 }}>{selectedPatient.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedPatient.user?.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{selectedPatient.user?.phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                <Typography variant="body1">{selectedPatient.gender || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1">
                  {selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Insurance Number</Typography>
                <Typography variant="body1">{selectedPatient.insurance_number || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body1">{selectedPatient.address || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>
                <Typography variant="body1">{selectedPatient.emergency_contact_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Emergency Phone</Typography>
                <Typography variant="body1">{selectedPatient.emergency_contact_phone || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Medical Notes</Typography>
                <Typography variant="body1">{selectedPatient.notes || 'No notes available'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Edit Patient Profile</DialogTitle>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 80, height: 80, mb: 1, border: '1px solid', borderColor: 'divider' }}
                />
                <IconButton
                  color="primary"
                  size="small"
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
                  <PhotoCameraIcon fontSize="small" />
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
                Patient Profile Photo
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="gender"
                  label="Gender"
                  fullWidth
                  margin="normal"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{ minWidth: 150 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="insurance_number"
                  label="Insurance Number"
                  fullWidth
                  margin="normal"
                  value={formData.insurance_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="emergency_contact_name"
                  label="Emergency Contact Name"
                  fullWidth
                  margin="normal"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="emergency_contact_phone"
                  label="Emergency Contact Phone"
                  fullWidth
                  margin="normal"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Medical Notes"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Profile'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminPatientsPage;
