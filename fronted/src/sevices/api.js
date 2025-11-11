import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bare Fibers API
export const bareFiberAPI = {
  create: (data) => api.post('/bare-fibers', data),
  getAll: () => api.get('/bare-fibers'),
  getAvailable: () => api.get('/bare-fibers/available'),
  getById: (fiberId) => api.get(`/bare-fibers/${fiberId}`),
};

// Cables API
export const cableAPI = {
  create: (data) => api.post('/cables', data),
  getAll: () => api.get('/cables'),
  getById: (cableId) => api.get(`/cables/${cableId}`),
  addFibers: (cableId, fibers) => api.post(`/cables/${cableId}/fibers`, { fibers }),
};

// QC Checks API
export const qcCheckAPI = {
  create: (data) => api.post('/qc-checks', data),
  getAll: () => api.get('/qc-checks'),
  getByCableId: (cableId) => api.get(`/qc-checks/${cableId}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;