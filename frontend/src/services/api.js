import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV ? '' : 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('clinic_auth');
  if (stored) {
    try {
      const auth = JSON.parse(stored);
      if (auth?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {
      // ignore parse errors
    }
  }

  if (config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete('Content-Type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
    }
  } else if (config.data !== undefined && config.method !== 'get' && config.method !== 'head') {
    config.headers = config.headers || {};
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }
  return config;
});

export default api;
