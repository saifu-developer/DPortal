import api from './api';

const BASE = '/api/appointments';

export const getAppointments = () => api.get(BASE);
export const getAppointmentsByPatient = (patientId) => api.get(`${BASE}/patient/${patientId}`);
export const getAppointmentById = (id) => api.get(`${BASE}/${id}`);
export const createAppointment = (data) => api.post(BASE, data);
export const updateAppointment = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteAppointment = (id) => api.delete(`${BASE}/${id}`);
