import AdminDashboardPage from './AdminDashboardPage';
import AdminDoctorsPage from './DoctorsPage';
import AdminPatientsPage from './PatientsPage';
import AdminDepartmentsPage from './DepartmentsPage';
import AdminSpecializationsPage from './SpecializationsPage';
import AdminServicesPage from './ServicesPage';
import PlaceholderPage from '../PlaceholderPage';

export {
  AdminDashboardPage,
  AdminDoctorsPage,
  AdminPatientsPage,
  AdminDepartmentsPage,
  AdminSpecializationsPage,
  AdminServicesPage,
};

export const AdminSchedulesPage = () => <PlaceholderPage title="Manage Schedules" />;
export const AdminAppointmentsPage = () => <PlaceholderPage title="Manage Appointments" />;
export const AdminPaymentsPage = () => <PlaceholderPage title="Manage Payments" />;
export const AdminStatisticsPage = () => <PlaceholderPage title="System Statistics" />;
