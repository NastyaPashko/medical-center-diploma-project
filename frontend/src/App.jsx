import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Patient Pages
import {
  PatientDashboardPage,
  PatientProfilePage,
  PatientServicesPage,
  PatientDoctorsPage,
  PatientSymptomsPage,
  PatientAppointmentsPage,
  PatientPaymentsPage
} from './pages/patient';

// Doctor Pages
import {
  DoctorDashboardPage,
  DoctorProfilePage,
  DoctorSchedulePage,
  DoctorAppointmentsPage,
  DoctorPatientNotesPage
} from './pages/doctor';

// Admin Pages
import {
  AdminDashboardPage,
  AdminDoctorsPage,
  AdminPatientsPage,
  AdminDepartmentsPage,
  AdminSpecializationsPage,
  AdminServicesPage,
  AdminSchedulesPage,
  AdminAppointmentsPage,
  AdminPaymentsPage,
  AdminStatisticsPage
} from './pages/admin';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // More medical teal
      light: '#e0f2f1',
    },
    secondary: {
      main: '#004d40',
    },
    background: {
      default: '#f4f7f6',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
              <Route path="/patient/services" element={<PatientServicesPage />} />
              <Route path="/patient/doctors" element={<PatientDoctorsPage />} />
              <Route path="/patient/symptoms" element={<PatientSymptomsPage />} />
              <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
              <Route path="/patient/payments" element={<PatientPaymentsPage />} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/profile" element={<DoctorProfilePage />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
              <Route path="/doctor/patient-notes" element={<DoctorPatientNotesPage />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
              <Route path="/admin/patients" element={<AdminPatientsPage />} />
              <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
              <Route path="/admin/specializations" element={<AdminSpecializationsPage />} />
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/schedules" element={<AdminSchedulesPage />} />
              <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/admin/statistics" element={<AdminStatisticsPage />} />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
