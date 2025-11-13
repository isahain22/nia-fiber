import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bareFiberAPI = {
  create: (data) => api.post('/bare-fibers', data),
  getAll: () => api.get('/bare-fibers'),
};

export const healthCheck = () => api.get('/health');

export default api;
