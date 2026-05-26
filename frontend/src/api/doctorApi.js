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
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    // If it's not FormData (though we should use it for photo), axios will handle it
    const response = await axiosClient.post('/doctor/profile', data, {
      ...config,
      params: { _method: 'PUT' } // Laravel's way to handle PUT with multipart/form-data
    });
    return response.data;
  },
};

export default doctorApi;
