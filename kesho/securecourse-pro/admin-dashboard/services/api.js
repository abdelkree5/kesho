import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('sc-admin-token');
};

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('sc-admin-token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('sc-admin-token');
  delete api.defaults.headers.Authorization;
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = (email, password, deviceId) => {
  return api.post('/auth/login', null, {
    params: {
      email,
      password,
      device_id: deviceId,
    },
  });
};

export default api;
