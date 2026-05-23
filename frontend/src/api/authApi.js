import axiosClient from './axiosClient';

const authApi = {
  login: async (payload) => {
    const response = await axiosClient.post('/login', payload);
    return response.data;
  },
  
  register: async (payload) => {
    const response = await axiosClient.post('/register', payload);
    return response.data;
  },
  
  logout: async () => {
    const response = await axiosClient.post('/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await axiosClient.get('/user');
    return response.data;
  },
};

export default authApi;
