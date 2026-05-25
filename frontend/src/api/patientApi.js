import axiosClient from './axiosClient';

const patientApi = {
  getProfile: async () => {
    const response = await axiosClient.get('/patient/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    // If data contains a File (avatar), use FormData and POST with _method=PUT
    if (data.avatar instanceof File) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      formData.append('_method', 'PUT');
      const response = await axiosClient.post('/patient/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await axiosClient.put('/patient/profile', data);
    return response.data;
  },
  getDoctors: async (params) => {
    const response = await axiosClient.get('/doctors', { params });
    return response.data;
  },
  getDoctorById: async (id) => {
    const response = await axiosClient.get(`/doctors/${id}`);
    return response.data;
  },
  getDepartments: async () => {
    const response = await axiosClient.get('/departments');
    return response.data;
  },
  getSpecializations: async (params) => {
    const response = await axiosClient.get('/specializations', { params });
    return response.data;
  },
};

export default patientApi;
