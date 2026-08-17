import api from './api';

const BASE = '/api/public/appointment-requests';

export const getAppointmentRequests = () => api.get(BASE);
export const getPendingRequestCount = () => api.get(`${BASE}/pending-count`);

export const REQUESTS_UPDATED_EVENT = 'appointment-requests-updated';

export const notifyRequestsUpdated = () => {
  window.dispatchEvent(new Event(REQUESTS_UPDATED_EVENT));
};

export const approveAppointmentRequest = async (id) => {
  const res = await api.put(`${BASE}/${id}/approve`);
  notifyRequestsUpdated();
  return res;
};

export const rejectAppointmentRequest = async (id) => {
  const res = await api.put(`${BASE}/${id}/reject`);
  notifyRequestsUpdated();
  return res;
};
