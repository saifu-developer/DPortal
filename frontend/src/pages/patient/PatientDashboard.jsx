import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/cards/StatCard';
import InfoCard from '../../components/cards/InfoCard';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentsByPatient } from '../../services/appointmentService';
import { getPrescriptionsByPatient } from '../../services/prescriptionService';
import { getPatientById } from '../../services/patientService';
import { isCancelled, normalizeStatus, statusBadgeClass } from '../../utils/appointmentStatus';

export default function PatientDashboard() {
  const { auth } = useAuth();
  const [upcoming, setUpcoming] = useState(null);
  const [recentRx, setRecentRx] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth?.patientId) return;
    const load = async () => {
      try {
        const [patientRes, apptRes, rxRes] = await Promise.all([
          getPatientById(auth.patientId),
          getAppointmentsByPatient(auth.patientId),
          getPrescriptionsByPatient(auth.patientId),
        ]);
        setPatient(patientRes.data);
        const today = new Date().toISOString().split('T')[0];
        const future = (apptRes.data || [])
          .filter((a) => a.appointmentDate >= today && !isCancelled(a.status))
          .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
        setUpcoming(future[0] || null);
        setRecentRx((rxRes.data || [])[0] || null);
      } catch (err) {
        console.error('Failed to load patient dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auth?.patientId]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1">
        <p className="text-sm text-slate-400">Welcome, {auth?.fullName}</p>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">My Health Dashboard</h2>
        <p className="text-sm text-slate-400">View appointments, prescriptions, and your medical summary.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Upcoming Appointment"
          value={loading ? '...' : upcoming ? upcoming.appointmentDate : 'None'}
          to="/patient/appointments"
          accent="purple"
        />
        <StatCard
          title="Recent Prescription"
          value={loading ? '...' : recentRx ? recentRx.diagnosis?.slice(0, 20) : 'None'}
          to="/patient/prescriptions"
          accent="amber"
        />
        <StatCard
          title="Patient Code"
          value={loading ? '...' : patient?.patientCode || '—'}
          to="/patient/profile"
          accent="teal"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Upcoming Appointment">
          {upcoming ? (
            <div className="space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-500">Date:</span> {upcoming.appointmentDate}</p>
              <p><span className="text-slate-500">Time:</span> {upcoming.appointmentTime?.slice(0, 5)}</p>
              <p>
                <span className="text-slate-500">Status:</span>{' '}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(upcoming.status)}`}>
                  {normalizeStatus(upcoming.status)}
                </span>
              </p>
              <p><span className="text-slate-500">Reason:</span> {upcoming.symptoms || '—'}</p>
              <Link to="/patient/appointments" className="inline-block pt-2 text-sm text-accent hover:underline">
                View all appointments →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No upcoming appointments.</p>
          )}
        </InfoCard>

        <InfoCard title="Medical Summary">
          <div className="space-y-2 text-sm text-slate-300">
            <p><span className="text-slate-500">Age:</span> {patient?.age ?? '—'}</p>
            <p><span className="text-slate-500">Gender:</span> {patient?.gender ?? '—'}</p>
            <p><span className="text-slate-500">Notes:</span> {patient?.medicalNotes || 'No notes on file.'}</p>
            {recentRx && (
              <p><span className="text-slate-500">Latest Diagnosis:</span> {recentRx.diagnosis}</p>
            )}
            <Link to="/patient/profile" className="inline-block pt-2 text-sm text-accent hover:underline">
              Edit profile →
            </Link>
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
