import api from './api';

const BASE = '/api/reports';

const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

export const getReports = () => api.get(BASE);

export const getReportsByPatient = (patientId) => api.get(`${BASE}/patient/${patientId}`);

export const getReportById = (id) => api.get(`${BASE}/${id}`);

export const uploadReport = (formData) => api.post(BASE, formData, multipartConfig);

export const updateReport = (id, formData) => api.put(`${BASE}/${id}`, formData, multipartConfig);

export const downloadReport = (id) =>
  api.get(`${BASE}/${id}/download`, { responseType: 'blob' });

export const deleteReport = (id) => api.delete(`${BASE}/${id}`);
