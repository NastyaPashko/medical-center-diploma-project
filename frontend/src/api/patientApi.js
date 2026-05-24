import axiosClient from './axiosClient';

const patientApi = {
  getProfile: async () => {
    const response = await axiosClient.get('/patient/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosClient.put('/patient/profile', data);
    return response.data;
  },
};

export default patientApi;
