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
  Grid,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import adminApi from '../../api/adminApi';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const WEEKDAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

const AdminSchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  const [formData, setFormData] = useState({
    doctor_profile_id: '',
    day_of_week: '',
    start_time: '09:00',
    end_time: '17:00',
    slot_duration_minutes: 30,
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedRes, docRes] = await Promise.all([
        adminApi.getSchedules(),
        adminApi.getDoctors(),
      ]);
      setSchedules(schedRes.data || []);
      setDoctors(docRes.data || []);
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

  const handleOpen = (schedule = null) => {
    setError(null);
    setSuccess(null);
    setValidationErrors({});
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        doctor_profile_id: schedule.doctor_profile_id,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time.substring(0, 5),
        end_time: schedule.end_time.substring(0, 5),
        slot_duration_minutes: schedule.slot_duration_minutes,
        is_active: !!schedule.is_active,
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        doctor_profile_id: '',
        day_of_week: '',
        start_time: '09:00',
        end_time: '17:00',
        slot_duration_minutes: 30,
        is_active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSchedule(null);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error when field changes
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setValidationErrors({});

    try {
      if (editingSchedule) {
        await adminApi.updateSchedule(editingSchedule.id, formData);
        setSuccess('Schedule updated successfully');
      } else {
        await adminApi.createSchedule(formData);
        setSuccess('Schedule created successfully');
      }
      handleClose();
      fetchData();
    } catch (err) {
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to save schedule');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (schedule) => {
    setScheduleToDelete(schedule);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminApi.deleteSchedule(scheduleToDelete.id);
      setSuccess('Schedule deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete schedule');
    } finally {
      setConfirmOpen(false);
      setScheduleToDelete(null);
    }
  };

  const getWeekdayLabel = (value) => {
    const day = WEEKDAYS.find((d) => d.value === value);
    return day ? day.label : value;
  };

  if (loading && schedules.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Doctor Schedules</Typography>
        <Box>
          <IconButton onClick={fetchData} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Schedule
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Department / Specialization</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Slot (min)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No schedules found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {schedule.doctor?.name || 'Unknown Doctor'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {schedule.doctor?.department || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {schedule.doctor?.specialization || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{getWeekdayLabel(schedule.day_of_week)}</TableCell>
                  <TableCell>
                    {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                  </TableCell>
                  <TableCell>{schedule.slot_duration_minutes}</TableCell>
                  <TableCell>
                    <Chip
                      label={schedule.is_active ? 'Active' : 'Inactive'}
                      color={schedule.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(schedule)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClick(schedule)} size="small" color="error">
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
        <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!validationErrors.doctor_profile_id}>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="doctor_profile_id"
                    value={formData.doctor_profile_id}
                    label="Doctor"
                    onChange={handleChange}
                    disabled={!!editingSchedule}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.user?.name} ({doctor.specialization?.name})
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.doctor_profile_id && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {validationErrors.doctor_profile_id[0]}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!validationErrors.day_of_week}>
                  <InputLabel>Day of Week</InputLabel>
                  <Select
                    name="day_of_week"
                    value={formData.day_of_week}
                    label="Day of Week"
                    onChange={handleChange}
                  >
                    {WEEKDAYS.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.day_of_week && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {validationErrors.day_of_week[0]}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Slot Duration (min)"
                  name="slot_duration_minutes"
                  type="number"
                  value={formData.slot_duration_minutes}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 10, max: 120, step: 5 }}
                  error={!!validationErrors.slot_duration_minutes}
                  helperText={validationErrors.slot_duration_minutes?.[0]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min
                  error={!!validationErrors.start_time}
                  helperText={validationErrors.start_time?.[0]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }} // 5 min
                  error={!!validationErrors.end_time}
                  helperText={validationErrors.end_time?.[0]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Active"
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
              {submitting ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default AdminSchedulesPage;
