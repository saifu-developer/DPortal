import axios from 'axios';

const normalizeBaseUrl = (url) => (url ? url.replace(/\/$/, '') : '');

const api = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL),
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (!path.startsWith('/login/') && path !== '/portal') {
        localStorage.removeItem('clinic_auth');
        window.location.assign('/portal');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
