import { useEffect, useState } from 'react';
import DataTable from '../../components/tables/DataTable';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentsByPatient } from '../../services/appointmentService';
import { normalizeStatus, statusBadgeClass } from '../../utils/appointmentStatus';

export default function PatientAppointments() {
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.patientId) return;
    getAppointmentsByPatient(auth.patientId)
      .then((res) => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [auth?.patientId]);

  const columns = [
    { key: 'appointmentDate', label: 'Date' },
    {
      key: 'appointmentTime',
      label: 'Time',
      render: (row) => row.appointmentTime?.slice(0, 5) || '—',
    },
    {
      key: 'symptoms',
      label: 'Reason',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.symptoms}>
          {row.symptoms || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
          {normalizeStatus(row.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white sm:text-2xl">My Appointments</h2>
        <p className="mt-1 text-sm text-slate-400">View your scheduled and past appointments</p>
      </div>
      <div className="card overflow-hidden p-0">
        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          emptyMessage="No appointments found."
        />
      </div>
    </div>
  );
}
