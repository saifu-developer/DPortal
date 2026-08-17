export const APPOINTMENT_STATUSES = [
  'PENDING',
  'APPROVED',
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
];

export function normalizeStatus(status) {
  if (!status) return 'SCHEDULED';
  return String(status).trim().toUpperCase();
}

export function isCompleted(status) {
  return normalizeStatus(status) === 'COMPLETED';
}

export function isCancelled(status) {
  return normalizeStatus(status) === 'CANCELLED';
}

export function canPrescribe(status) {
  const s = normalizeStatus(status);
  return s !== 'COMPLETED' && s !== 'CANCELLED';
}

export function statusBadgeClass(status) {
  const s = normalizeStatus(status);
  if (s === 'COMPLETED') return 'bg-teal-500/20 text-teal-400';
  if (s === 'CANCELLED') return 'bg-red-500/20 text-red-400';
  if (s === 'PENDING' || s === 'APPROVED') return 'bg-blue-500/20 text-blue-400';
  return 'bg-amber-500/20 text-amber-400';
}
