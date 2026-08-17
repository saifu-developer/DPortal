import { useEffect, useState } from 'react';
import DataTable from '../components/tables/DataTable';
import InfoCard from '../components/cards/InfoCard';
import { useDialog } from '../context/DialogContext';
import {
  getAppointmentRequests,
  approveAppointmentRequest,
  rejectAppointmentRequest,
} from '../services/appointmentRequestService';

const statusBadge = (status) => {
  const colors = {
    PENDING: 'bg-amber-500/20 text-amber-400',
    APPROVED: 'bg-emerald-500/20 text-emerald-400',
    REJECTED: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] || 'bg-slate-500/20 text-slate-400'}`}>
      {status}
    </span>
  );
};

export default function AppointmentRequests() {
  const { showAlert, showConfirm } = useDialog();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAppointmentRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load appointment requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    const confirmed = await showConfirm(
      'Approve this request? A patient record (if needed) and a scheduled appointment will be created automatically.',
      {
        title: 'Approve Request',
        confirmLabel: 'Approve',
        variant: 'primary',
      }
    );
    if (!confirmed) return;

    setActionId(id);
    try {
      await approveAppointmentRequest(id);
      await fetchRequests();
      await showAlert('Request approved. Patient and appointment created.', 'Success');
    } catch (err) {
      console.error('Failed to approve request', err);
      await showAlert(err.response?.data?.message || err.response?.data || 'Failed to approve request.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (id) => {
    const confirmed = await showConfirm('Reject this appointment request?', {
      title: 'Reject Request',
      confirmLabel: 'Reject',
      variant: 'danger',
    });
    if (!confirmed) return;

    setActionId(id);
    try {
      await rejectAppointmentRequest(id);
      await fetchRequests();
      await showAlert('Request rejected.', 'Success');
    } catch (err) {
      console.error('Failed to reject request', err);
      await showAlert('Failed to reject request.');
    } finally {
      setActionId(null);
    }
  };

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'mobileNumber', label: 'Mobile Number' },
    { key: 'email', label: 'Email' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    {
      key: 'reasonForVisit',
      label: 'Reason For Visit',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.reasonForVisit}>
          {row.reasonForVisit}
        </span>
      ),
    },
    { key: 'preferredDate', label: 'Preferred Date' },
    { key: 'preferredTimeSlot', label: 'Preferred Time' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => statusBadge(row.status),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.status === 'PENDING' ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApprove(row.id)}
              disabled={actionId === row.id}
              className="btn-primary py-1 text-xs"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => handleReject(row.id)}
              disabled={actionId === row.id}
              className="btn-danger"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-500">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Appointment Requests{pendingCount > 0 ? ` (${pendingCount})` : ''}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Review public booking requests. Approving creates the patient and appointment automatically.
        </p>
      </div>

      <InfoCard title="Incoming Requests">
        <DataTable
          columns={columns}
          data={requests}
          loading={loading}
          emptyMessage="No appointment requests yet."
        />
      </InfoCard>
    </div>
  );
}
