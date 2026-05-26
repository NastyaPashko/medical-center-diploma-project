import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import doctorApi from '../../api/doctorApi';

const DoctorSchedulePage = () => {
  const { t } = useTranslation();

  const WEEKDAYS = [
    { value: 1, label: t('weekdays.monday') },
    { value: 2, label: t('weekdays.tuesday') },
    { value: 3, label: t('weekdays.wednesday') },
    { value: 4, label: t('weekdays.thursday') },
    { value: 5, label: t('weekdays.friday') },
    { value: 6, label: t('weekdays.saturday') },
    { value: 7, label: t('weekdays.sunday') },
  ];

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await doctorApi.getSchedule();
      setSchedules(response.data || []);
      setError(null);
    } catch (err) {
      setError(t('common.error') + ': ' + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

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
        <Typography variant="h4">{t('doctor.working_schedule')}</Typography>
        <IconButton onClick={fetchSchedule} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('doctor.weekday')}</TableCell>
              <TableCell>{t('doctor.start_time')}</TableCell>
              <TableCell>{t('doctor.end_time')}</TableCell>
              <TableCell>{t('doctor.slot_duration')}</TableCell>
              <TableCell>{t('common.status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    {t('common.no_data')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {getWeekdayLabel(schedule.day_of_week)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                      {schedule.start_time.substring(0, 5)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                      {schedule.end_time.substring(0, 5)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {t('doctor.slot_duration_minutes', { count: schedule.slot_duration_minutes })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={schedule.is_active ? t('common.active') : t('common.inactive')}
                      color={schedule.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DoctorSchedulePage;
