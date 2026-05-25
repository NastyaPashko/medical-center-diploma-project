import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import './App.css';

// Patient Pages
import {
  PatientDashboardPage,
  PatientProfilePage,
  PatientServicesPage,
  PatientDoctorsPage,
  PatientDoctorDetailsPage,
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

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboardPage /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
            <Route path="/patient/services" element={<ProtectedRoute><PatientServicesPage /></ProtectedRoute>} />
            <Route path="/patient/doctors" element={<ProtectedRoute><PatientDoctorsPage /></ProtectedRoute>} />
            <Route path="/patient/doctors/:id" element={<ProtectedRoute><PatientDoctorDetailsPage /></ProtectedRoute>} />
            <Route path="/patient/symptoms" element={<ProtectedRoute><PatientSymptomsPage /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute><PatientAppointmentsPage /></ProtectedRoute>} />
            <Route path="/patient/payments" element={<ProtectedRoute><PatientPaymentsPage /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboardPage /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute><DoctorProfilePage /></ProtectedRoute>} />
            <Route path="/doctor/schedule" element={<ProtectedRoute><DoctorSchedulePage /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute><DoctorAppointmentsPage /></ProtectedRoute>} />
            <Route path="/doctor/patient-notes" element={<ProtectedRoute><DoctorPatientNotesPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute><AdminDoctorsPage /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute><AdminPatientsPage /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute><AdminDepartmentsPage /></ProtectedRoute>} />
            <Route path="/admin/specializations" element={<ProtectedRoute><AdminSpecializationsPage /></ProtectedRoute>} />
            <Route path="/admin/services" element={<ProtectedRoute><AdminServicesPage /></ProtectedRoute>} />
            <Route path="/admin/schedules" element={<ProtectedRoute><AdminSchedulesPage /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute><AdminAppointmentsPage /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute><AdminPaymentsPage /></ProtectedRoute>} />
            <Route path="/admin/statistics" element={<ProtectedRoute><AdminStatisticsPage /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
