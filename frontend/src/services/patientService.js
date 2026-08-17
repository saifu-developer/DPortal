import api from './api';

const BASE = '/api/patients';

export const getPatients = () => api.get(BASE);
export const getPatientById = (id) => api.get(`${BASE}/${id}`);
export const getPatientProfile = (id) => api.get(`${BASE}/${id}/profile`);
export const searchPatientByCode = (code) => api.get(`${BASE}/search`, { params: { code } });
export const searchPatientByMobile = (mobile) => api.get(`${BASE}/search`, { params: { mobile } });
export const createPatient = (data) => api.post(BASE, data);
export const updatePatient = (id, data) => api.put(`${BASE}/${id}`, data);
export const deletePatient = (id) => api.delete(`${BASE}/${id}`);
