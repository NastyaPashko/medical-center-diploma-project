import React from 'react';
import PlaceholderPage from '../PlaceholderPage';

import DoctorDashboardPage from './DoctorDashboardPage';
import DoctorSchedulePage from './DoctorSchedulePage';
import DoctorProfilePage from './DoctorProfilePage';

export { DoctorDashboardPage };
export { DoctorProfilePage };
export { DoctorSchedulePage };
export const DoctorAppointmentsPage = () => <PlaceholderPage title="Appointments" />;
export const DoctorPatientNotesPage = () => <PlaceholderPage title="Patient Notes" />;
