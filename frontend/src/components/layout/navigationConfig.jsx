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
    { text: 'sidebar.dashboard', path: '/patient/dashboard', icon: <DashboardIcon /> },
    { text: 'sidebar.my_profile', path: '/patient/profile', icon: <PersonIcon /> },
    { text: 'sidebar.services', path: '/patient/services', icon: <ServicesIcon /> },
    { text: 'sidebar.doctors', path: '/patient/doctors', icon: <DoctorIcon /> },
    { text: 'sidebar.symptoms', path: '/patient/symptoms', icon: <SymptomsIcon /> },
    { text: 'sidebar.appointments', path: '/patient/appointments', icon: <AppointmentIcon /> },
    { text: 'sidebar.payments', path: '/patient/payments', icon: <PaymentIcon /> },
  ],
  doctor: [
    { text: 'sidebar.dashboard', path: '/doctor/dashboard', icon: <DashboardIcon /> },
    { text: 'sidebar.my_profile', path: '/doctor/profile', icon: <PersonIcon /> },
    { text: 'sidebar.my_schedule', path: '/doctor/schedule', icon: <ScheduleIcon /> },
    { text: 'sidebar.appointments', path: '/doctor/appointments', icon: <AppointmentIcon /> },
    { text: 'sidebar.patient_notes', path: '/doctor/patient-notes', icon: <NotesIcon /> },
  ],
  admin: [
    { text: 'sidebar.dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'sidebar.departments', path: '/admin/departments', icon: <ServicesIcon /> },
    { text: 'sidebar.specializations', path: '/admin/specializations', icon: <SpecializationIcon /> },
    { text: 'sidebar.services', path: '/admin/services', icon: <ServicesIcon /> },
    { text: 'sidebar.doctors', path: '/admin/doctors', icon: <DoctorIcon /> },
    { text: 'sidebar.patients', path: '/admin/patients', icon: <PeopleIcon /> },
    { text: 'sidebar.schedules', path: '/admin/schedules', icon: <ScheduleIcon /> },
    { text: 'sidebar.appointments', path: '/admin/appointments', icon: <AppointmentIcon /> },
    { text: 'sidebar.payments', path: '/admin/payments', icon: <PaymentIcon /> },
    { text: 'sidebar.statistics', path: '/admin/statistics', icon: <StatisticsIcon /> },
  ],
};
