import { useEffect, useState } from 'react';
import { usePortalAuth } from '../context/AuthContext';
import StatCard from '../components/cards/StatCard';
import InfoCard from '../components/cards/InfoCard';
import DataTable from '../components/tables/DataTable';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import { getPatients } from '../services/patientService';
import { getAppointments } from '../services/appointmentService';
import { getPrescriptions } from '../services/prescriptionService';
import { getAppointmentRequests } from '../services/appointmentRequestService';
import { normalizeStatus } from '../utils/appointmentStatus';

export default function Dashboard() {
  const doctor = usePortalAuth('admin');
  const [stats, setStats] = useState({
    totalAppointments: 0,
    patients: 0,
    prescriptions: 0,
    pendingRequests: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [patientsRes, appointmentsRes, prescriptionsRes, requestsRes] = await Promise.all([
          getPatients(),
          getAppointments(),
          getPrescriptions(),
          getAppointmentRequests(),
        ]);

        const patientList = patientsRes.data || [];
        const appointmentList = appointmentsRes.data || [];
        const requestList = requestsRes.data || [];
        const patientMap = Object.fromEntries(patientList.map((p) => [p.id, p.fullName]));

        setStats({
          totalAppointments: appointmentList.length,
          patients: patientList.length,
          prescriptions: (prescriptionsRes.data || []).length,
          pendingRequests: requestList.filter((r) => r.status === 'PENDING').length,
        });

        const activities = [
          ...requestList.slice(0, 3).map((r) => ({
            id: `req-${r.id}`,
            type: 'Request',
            detail: `${r.patientName} — ${r.reasonForVisit?.slice(0, 40) || 'Appointment request'}`,
            date: r.preferredDate,
            status: r.status,
          })),
          ...appointmentList.slice(0, 5).map((a) => ({
            id: `appt-${a.id}`,
            type: 'Appointment',
            detail: patientMap[a.patientId] || `Appointment #${a.id}`,
            date: a.appointmentDate,
            status: normalizeStatus(a.status),
          })),
        ].slice(0, 8);

        setRecentActivity(activities);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activityColumns = [
    { key: 'type', label: 'Type' },
    {
      key: 'detail',
      label: 'Details',
      render: (row) => (
        <span className="block max-w-xs truncate font-medium text-slate-200" title={row.detail}>
          {row.detail}
        </span>
      ),
    },
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusBadge
          status={row.status}
          type={row.type === 'Request' ? 'request' : 'appointment'}
        />
      ),
    },
  ];

  return (
    <div className="admin-page">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${doctor?.fullName || 'Doctor'}. Overview of patients, appointments, prescriptions, and pending requests.`}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={loading ? '...' : stats.patients}
          description="Registered in your clinic"
          to="/patients"
          accent="teal"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Appointments"
          value={loading ? '...' : stats.totalAppointments}
          description="Scheduled and completed"
          to="/appointments"
          accent="purple"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Total Prescriptions"
          value={loading ? '...' : stats.prescriptions}
          description="Treatment records issued"
          to="/prescriptions"
          accent="amber"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />
        <StatCard
          title="Pending Requests"
          value={loading ? '...' : stats.pendingRequests}
          description="Awaiting your review"
          to="/appointment-requests"
          accent="blue"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <InfoCard title="Recent Activity" noPadding>
        <DataTable
          columns={activityColumns}
          data={recentActivity}
          loading={loading}
          emptyMessage="No recent activity"
          emptyIcon="appointments"
        />
      </InfoCard>
    </div>
  );
}
