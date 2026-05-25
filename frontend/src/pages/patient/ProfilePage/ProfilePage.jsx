import React, { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Typography, Alert, Snackbar } from '@mui/material';
import patientApi from '../../../api/patientApi';
import authApi from '../../../api/authApi';
import ProfileHeader from './ProfileHeader';
import ProfileView from './ProfileView';
import ProfileForm from './ProfileForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userData, profileData] = await Promise.all([
        authApi.getCurrentUser(),
        patientApi.getProfile(),
      ]);
      setUser(userData.data);
      setProfile(profileData.data);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (formData) => {
    try {
      setSaveLoading(true);
      setSaveError(null);
      const response = await patientApi.updateProfile(formData);
      const updatedProfile = response.data;
      setProfile(updatedProfile);
      
      // Update user state using the data returned from the profile update
      if (updatedProfile.user) {
        setUser(updatedProfile.user);
      } else {
        // Fallback to separate fetch if user data is missing
        const userData = await authApi.getCurrentUser();
        setUser(userData.data);
      }
      
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      const message = err.response?.data?.message || 'Failed to update profile. Please check your input.';
      setSaveError(message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>

      <ProfileHeader user={user} />

      {isEditing ? (
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          loading={saveLoading}
          error={saveError}
        />
      ) : (
        <ProfileView
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
