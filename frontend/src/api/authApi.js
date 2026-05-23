import axiosClient from './axiosClient';

const authApi = {
  login: (payload) => axiosClient.post('/login', payload),
  
  register: (payload) => axiosClient.post('/register', payload),
  
  logout: () => axiosClient.post('/logout'),
  
  getCurrentUser: () => axiosClient.get('/user'),
};

export default authApi;
