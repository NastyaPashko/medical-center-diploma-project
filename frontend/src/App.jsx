import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import './App.css';

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

// Temporary placeholder for dashboard content
const Placeholder = ({ title }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>{title}</Typography>
    <Typography variant="body1">Content for {title} will be implemented soon.</Typography>
  </Box>
);

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
              <Route path="/patient/dashboard" element={<DashboardLayout><Placeholder title="Patient Dashboard" /></DashboardLayout>} />
              <Route path="/patient/profile" element={<DashboardLayout><Placeholder title="Patient Profile" /></DashboardLayout>} />
              <Route path="/patient/services" element={<DashboardLayout><Placeholder title="Medical Services" /></DashboardLayout>} />
              <Route path="/patient/doctors" element={<DashboardLayout><Placeholder title="Find Doctors" /></DashboardLayout>} />
              <Route path="/patient/symptoms" element={<DashboardLayout><Placeholder title="Symptom Checker" /></DashboardLayout>} />
              <Route path="/patient/appointments" element={<DashboardLayout><Placeholder title="My Appointments" /></DashboardLayout>} />
              <Route path="/patient/payments" element={<DashboardLayout><Placeholder title="Payments & Invoices" /></DashboardLayout>} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DashboardLayout><Placeholder title="Doctor Dashboard" /></DashboardLayout>} />
              <Route path="/doctor/profile" element={<DashboardLayout><Placeholder title="Doctor Profile" /></DashboardLayout>} />
              <Route path="/doctor/schedule" element={<DashboardLayout><Placeholder title="My Schedule" /></DashboardLayout>} />
              <Route path="/doctor/appointments" element={<DashboardLayout><Placeholder title="Appointments" /></DashboardLayout>} />
              <Route path="/doctor/patient-notes" element={<DashboardLayout><Placeholder title="Patient Notes" /></DashboardLayout>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<DashboardLayout><Placeholder title="Admin Dashboard" /></DashboardLayout>} />
              <Route path="/admin/doctors" element={<DashboardLayout><Placeholder title="Manage Doctors" /></DashboardLayout>} />
              <Route path="/admin/patients" element={<DashboardLayout><Placeholder title="Manage Patients" /></DashboardLayout>} />
              <Route path="/admin/specializations" element={<DashboardLayout><Placeholder title="Manage Specializations" /></DashboardLayout>} />
              <Route path="/admin/services" element={<DashboardLayout><Placeholder title="Manage Services" /></DashboardLayout>} />
              <Route path="/admin/schedules" element={<DashboardLayout><Placeholder title="Manage Schedules" /></DashboardLayout>} />
              <Route path="/admin/appointments" element={<DashboardLayout><Placeholder title="Manage Appointments" /></DashboardLayout>} />
              <Route path="/admin/payments" element={<DashboardLayout><Placeholder title="Manage Payments" /></DashboardLayout>} />
              <Route path="/admin/statistics" element={<DashboardLayout><Placeholder title="System Statistics" /></DashboardLayout>} />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
