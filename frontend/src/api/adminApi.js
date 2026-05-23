import axiosClient from './axiosClient';

const adminApi = {
  // Departments
  getDepartments: async () => {
    const response = await axiosClient.get('/admin/departments');
    return response.data;
  },
  createDepartment: async (data) => {
    const response = await axiosClient.post('/admin/departments', data);
    return response.data;
  },
  updateDepartment: async (id, data) => {
    const response = await axiosClient.put(`/admin/departments/${id}`, data);
    return response.data;
  },
  deleteDepartment: async (id) => {
    const response = await axiosClient.delete(`/admin/departments/${id}`);
    return response.data;
  },

  // Specializations
  getSpecializations: async () => {
    const response = await axiosClient.get('/admin/specializations');
    return response.data;
  },
  createSpecialization: async (data) => {
    const response = await axiosClient.post('/admin/specializations', data);
    return response.data;
  },
  updateSpecialization: async (id, data) => {
    const response = await axiosClient.put(`/admin/specializations/${id}`, data);
    return response.data;
  },
  deleteSpecialization: async (id) => {
    const response = await axiosClient.delete(`/admin/specializations/${id}`);
    return response.data;
  },

  // Medical Services
  getServices: async () => {
    const response = await axiosClient.get('/admin/services');
    return response.data;
  },
  createService: async (data) => {
    const response = await axiosClient.post('/admin/services', data);
    return response.data;
  },
  updateService: async (id, data) => {
    const response = await axiosClient.put(`/admin/services/${id}`, data);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await axiosClient.delete(`/admin/services/${id}`);
    return response.data;
  },

  // Doctors
  getDoctors: async () => {
    const response = await axiosClient.get('/admin/doctors');
    return response.data;
  },
  createDoctor: async (data) => {
    const response = await axiosClient.post('/admin/doctors', data);
    return response.data;
  },
  updateDoctor: async (id, data) => {
    const response = await axiosClient.put(`/admin/doctors/${id}`, data);
    return response.data;
  },
  deleteDoctor: async (id) => {
    const response = await axiosClient.delete(`/admin/doctors/${id}`);
    return response.data;
  },

  // Patients
  getPatients: async () => {
    const response = await axiosClient.get('/admin/patients');
    return response.data;
  },
  getPatient: async (id) => {
    const response = await axiosClient.get(`/admin/patients/${id}`);
    return response.data;
  },
  updatePatient: async (id, data) => {
    const response = await axiosClient.put(`/admin/patients/${id}`, data);
    return response.data;
  },
};

export default adminApi;
