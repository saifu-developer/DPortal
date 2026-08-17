import api from './api';

const BASE = '/api/doctors';

export const getDoctors = () => api.get(BASE);
export const getDoctorById = (id) => api.get(`${BASE}/${id}`);
export const createDoctor = (data) => api.post(BASE, data);
export const updateDoctor = (id, data) => api.put(`${BASE}/${id}`, data);
export const deleteDoctor = (id) => api.delete(`${BASE}/${id}`);
