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
    // If data contains a File (avatar), use FormData and POST with _method=PUT
    if (data.avatar instanceof File || data instanceof FormData) {
      const formData = data instanceof FormData ? data : new FormData();
      
      if (!(data instanceof FormData)) {
        Object.keys(data).forEach((key) => {
          if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
          }
        });
        formData.append('_method', 'PUT');
      }

      const response = await axiosClient.post(`/admin/patients/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    const response = await axiosClient.put(`/admin/patients/${id}`, data);
    return response.data;
  },

  // Users
  getUsers: async (params) => {
    const response = await axiosClient.get('/admin/users', { params });
    return response.data;
  },

  // Schedules
  getSchedules: async () => {
    const response = await axiosClient.get('/admin/schedules');
    return response.data;
  },
  createSchedule: async (data) => {
    const response = await axiosClient.post('/admin/schedules', data);
    return response.data;
  },
  updateSchedule: async (id, data) => {
    const response = await axiosClient.put(`/admin/schedules/${id}`, data);
    return response.data;
  },
  deleteSchedule: async (id) => {
    const response = await axiosClient.delete(`/admin/schedules/${id}`);
    return response.data;
  },
};

export default adminApi;
