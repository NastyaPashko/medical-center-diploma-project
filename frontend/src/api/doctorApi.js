import axiosClient from './axiosClient';

const doctorApi = {
  getSchedule: async () => {
    const response = await axiosClient.get('/doctor/schedule');
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosClient.get('/doctor/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosClient.put('/doctor/profile', data);
    return response.data;
  },
};

export default doctorApi;
