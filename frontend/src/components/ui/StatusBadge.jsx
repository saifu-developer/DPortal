import { normalizeStatus } from '../../utils/appointmentStatus';

const APPOINTMENT_BADGES = {
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-danger',
  PENDING: 'badge-info',
  APPROVED: 'badge-info',
  SCHEDULED: 'badge-warning',
};

const PRESCRIPTION_BADGES = {
  COMPLETED: 'badge-success',
  CANCELLED: 'badge-danger',
  DRAFT: 'badge-warning',
};

const REQUEST_BADGES = {
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
};

export default function StatusBadge({ status, type = 'appointment' }) {
  const normalized = normalizeStatus(status);

  if (type === 'request') {
    const badgeClass = REQUEST_BADGES[status] || 'badge-neutral';
    return <span className={`badge ${badgeClass}`}>{status || '—'}</span>;
  }

  if (type === 'prescription') {
    const badgeClass =
      PRESCRIPTION_BADGES[normalized] ||
      (normalized === 'COMPLETED'
        ? 'badge-success'
        : normalized === 'CANCELLED'
          ? 'badge-danger'
          : 'badge-warning');
    const label =
      normalized === 'COMPLETED' ? 'Completed' : normalized === 'CANCELLED' ? 'Cancelled' : 'Draft';
    return <span className={`badge ${badgeClass}`}>{label}</span>;
  }

  const badgeClass = APPOINTMENT_BADGES[normalized] || 'badge-neutral';
  return <span className={`badge ${badgeClass}`}>{normalized}</span>;
}
