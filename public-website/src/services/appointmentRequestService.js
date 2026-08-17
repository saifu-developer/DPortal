import api from './api';

const BASE = '/api/public/appointment-requests';

export const submitAppointmentRequest = (data) => api.post(BASE, data);

export const getSlotAvailability = (date) =>
  api.get(`${BASE}/availability`, { params: { date } });
