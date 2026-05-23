import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Link,
  Avatar,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login({
        email: email.trim(),
        password,
      });

      console.log('Login successful:', data);
      
      // Redirect based on role
      const role = data.user.role?.toLowerCase() || 'patient';
      navigate(`/${role}/dashboard`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e0f2f1 0%, #e8f5e9 100%)',
        py: 8,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <Avatar 
              sx={{ 
                m: 1, 
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                mb: 2,
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
              }}
            >
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            
            <Typography component="h1" variant="h4" fontWeight="700" color="text.primary" gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Sign in to manage your appointments and health records
            </Typography>
            
            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    width: '100%',
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mt: 4, 
                  mb: 2, 
                  py: 1.5, 
                  borderRadius: 2,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    variant="subtitle2"
                    sx={{ 
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
