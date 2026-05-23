import React from 'react';
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  MedicalServices as ServicesIcon,
  People as PeopleIcon,
  Event as AppointmentIcon,
  Payment as PaymentIcon,
  LocalHospital as DoctorIcon,
  Notes as NotesIcon,
  Category as SpecializationIcon,
  BarChart as StatisticsIcon,
  Schedule as ScheduleIcon,
  History as SymptomsIcon,
} from '@mui/icons-material';

export const navigationItemsByRole = {
  patient: [
    { text: 'Dashboard', path: '/patient/dashboard', icon: <DashboardIcon /> },
    { text: 'Profile', path: '/patient/profile', icon: <PersonIcon /> },
    { text: 'Services', path: '/patient/services', icon: <ServicesIcon /> },
    { text: 'Doctors', path: '/patient/doctors', icon: <DoctorIcon /> },
    { text: 'Symptoms', path: '/patient/symptoms', icon: <SymptomsIcon /> },
    { text: 'Appointments', path: '/patient/appointments', icon: <AppointmentIcon /> },
    { text: 'Payments', path: '/patient/payments', icon: <PaymentIcon /> },
  ],
  doctor: [
    { text: 'Dashboard', path: '/doctor/dashboard', icon: <DashboardIcon /> },
    { text: 'Profile', path: '/doctor/profile', icon: <PersonIcon /> },
    { text: 'Schedule', path: '/doctor/schedule', icon: <ScheduleIcon /> },
    { text: 'Appointments', path: '/doctor/appointments', icon: <AppointmentIcon /> },
    { text: 'Patient Notes', path: '/doctor/patient-notes', icon: <NotesIcon /> },
  ],
  admin: [
    { text: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Doctors', path: '/admin/doctors', icon: <DoctorIcon /> },
    { text: 'Patients', path: '/admin/patients', icon: <PeopleIcon /> },
    { text: 'Specializations', path: '/admin/specializations', icon: <SpecializationIcon /> },
    { text: 'Services', path: '/admin/services', icon: <ServicesIcon /> },
    { text: 'Schedules', path: '/admin/schedules', icon: <ScheduleIcon /> },
    { text: 'Appointments', path: '/admin/appointments', icon: <AppointmentIcon /> },
    { text: 'Payments', path: '/admin/payments', icon: <PaymentIcon /> },
    { text: 'Statistics', path: '/admin/statistics', icon: <StatisticsIcon /> },
  ],
};
