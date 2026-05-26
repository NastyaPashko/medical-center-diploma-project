import React from 'react';
import PatientDashboardPage from './PatientDashboardPage';
import ProfilePage from './ProfilePage/ProfilePage';
import DoctorListPage from './DoctorsPage/DoctorListPage';
import DoctorDetailsPage from './DoctorsPage/DoctorDetailsPage';

export { PatientDashboardPage };
export { ProfilePage as PatientProfilePage };
export const PatientServicesPage = () => <PlaceholderPage title="Medical Services" />;
export { DoctorListPage as PatientDoctorsPage };
export { DoctorDetailsPage as PatientDoctorDetailsPage };
export const PatientSymptomsPage = () => <PlaceholderPage title="Symptom Checker" />;
export const PatientAppointmentsPage = () => <PlaceholderPage title="My Appointments" />;
export const PatientPaymentsPage = () => <PlaceholderPage title="Payments & Invoices" />;
