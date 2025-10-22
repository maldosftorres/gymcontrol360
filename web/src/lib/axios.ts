import axios from 'axios';
import { getToken, removeToken, removeUser } from './storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});

// Request interceptor para adjuntar el token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Petición axios:', config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`);
    console.log('📦 Data:', config.data);
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;