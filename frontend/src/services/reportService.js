import api from './api';

const BASE = '/api/reports';

export const getReports = () => api.get(BASE);

export const getReportsByPatient = (patientId) => api.get(`${BASE}/patient/${patientId}`);

export const getReportById = (id) => api.get(`${BASE}/${id}`);

export const uploadReport = (formData) => api.post(BASE, formData);

export const updateReport = (id, formData) => api.put(`${BASE}/${id}`, formData);

export const downloadReport = (id) =>
  api.get(`${BASE}/${id}/download`, { responseType: 'blob' });

export const deleteReport = (id) => api.delete(`${BASE}/${id}`);
