import { useEffect, useState } from 'react';
import StatCard from '../../components/cards/StatCard';
import { getPatients } from '../../services/patientService';
import { getPrescriptions } from '../../services/prescriptionService';
import { getReports } from '../../services/reportService';

export default function StaffDashboard() {
  const [stats, setStats] = useState({ patients: 0, prescriptions: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPatients(), getPrescriptions(), getReports()])
      .then(([p, rx, r]) => {
        setStats({
          patients: (p.data || []).length,
          prescriptions: (rx.data || []).length,
          reports: (r.data || []).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-400">Staff Portal</p>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Patients" value={loading ? '...' : stats.patients} accent="teal" />
        <StatCard title="Prescriptions" value={loading ? '...' : stats.prescriptions} accent="amber" />
        <StatCard title="Reports" value={loading ? '...' : stats.reports} accent="blue" />
      </div>
    </div>
  );
}
