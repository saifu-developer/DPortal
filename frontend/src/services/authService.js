import api from './api';

export const sendOtp = (email) => api.post('/api/auth/otp/send', { email });
export const verifyOtp = (email, otp) => api.post('/api/auth/otp/verify', { email, otp });
export const staffLogin = (username, password) =>
  api.post('/api/auth/staff/login', { username, password });
export const doctorLogin = (username, password) =>
  api.post('/api/auth/doctor/login', { username, password });
export const validateSession = () => api.get('/api/auth/validate');
