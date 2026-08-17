import api from './api';

const BASE = '/api/prescriptions';

export const getPrescriptions = () => api.get(BASE);
export const getPrescriptionsByPatient = (patientId) => api.get(`${BASE}/patient/${patientId}`);
export const getPrescriptionById = (id) => api.get(`${BASE}/${id}`);
export const createPrescription = (data) => api.post(BASE, data);
export const updatePrescription = (id, data) => api.put(`${BASE}/${id}`, data);
export const deletePrescription = (id) => api.delete(`${BASE}/${id}`);
export const downloadPrescriptionPdf = (id) =>
  api.get(`${BASE}/${id}/pdf`, { responseType: 'blob' });
