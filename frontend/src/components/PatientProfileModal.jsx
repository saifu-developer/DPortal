import { useEffect, useState } from 'react';
import DataTable from './tables/DataTable';
import { getPatientProfile } from '../services/patientService';
import { normalizeStatus, statusBadgeClass } from '../utils/appointmentStatus';

export default function PatientProfileModal({ patientId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('details');

  useEffect(() => {
    if (!patientId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPatientProfile(patientId);
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load patient profile', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (!patientId) return null;

  const patient = profile?.patient;
  const tabs = [
    { id: 'details', label: 'Personal Info' },
    { id: 'summary', label: 'Medical Summary' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'reports', label: 'Reports' },
  ];

  const appointmentColumns = [
    { key: 'appointmentDate', label: 'Date' },
    {
      key: 'appointmentTime',
      label: 'Time',
      render: (row) => row.appointmentTime?.slice(0, 5) || '—',
    },
    { key: 'symptoms', label: 'Symptoms' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(row.status)}`}>
          {normalizeStatus(row.status)}
        </span>
      ),
    },
  ];

  const prescriptionColumns = [
    { key: 'diagnosis', label: 'Diagnosis' },
    {
      key: 'medicines',
      label: 'Medicines',
      render: (row) => (
        <span className="block max-w-xs truncate" title={row.medicines}>
          {row.medicines}
        </span>
      ),
    },
    { key: 'prescribedDate', label: 'Date' },
  ];

  const reportColumns = [
    { key: 'reportName', label: 'Report' },
    { key: 'reportType', label: 'Type' },
    { key: 'uploadDate', label: 'Upload Date' },
  ];

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-slate-400">Loading medical record...</p>
      ) : patient ? (
        <>
          <div className="rounded-lg border border-slate-700/60 bg-surface px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Patient Record</p>
            <p className="mt-1 text-lg font-semibold text-white">{patient.fullName}</p>
            <p className="text-sm text-slate-400">
              {patient.patientCode} · {patient.mobile}
              {patient.email ? ` · ${patient.email}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  tab === t.id
                    ? 'bg-accent/15 text-accent'
                    : 'text-slate-400 hover:bg-surface-overlay hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'details' && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Patient Code" value={patient.patientCode} />
              <Detail label="Full Name" value={patient.fullName} />
              <Detail label="Mobile" value={patient.mobile} />
              <Detail label="Email" value={patient.email || '—'} />
              <Detail label="Age" value={patient.age} />
              <Detail label="Gender" value={patient.gender} />
              <Detail label="Address" value={patient.address || '—'} />
              <div className="sm:col-span-2">
                <Detail label="Medical Notes" value={patient.medicalNotes || '—'} />
              </div>
            </div>
          )}

          {tab === 'summary' && (
            <div className="rounded-lg border border-slate-700/60 bg-surface p-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Latest Medical Summary
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                {profile.medicalSummary || 'No medical summary available.'}
              </p>
            </div>
          )}

          {tab === 'appointments' && (
            <DataTable
              columns={appointmentColumns}
              data={profile.appointments || []}
              emptyMessage="No appointments on record."
            />
          )}

          {tab === 'prescriptions' && (
            <DataTable
              columns={prescriptionColumns}
              data={profile.prescriptions || []}
              emptyMessage="No prescriptions on record."
            />
          )}

          {tab === 'reports' && (
            <DataTable
              columns={reportColumns}
              data={profile.reports || []}
              emptyMessage="No reports uploaded."
            />
          )}
        </>
      ) : (
        <p className="text-sm text-red-400">Failed to load patient profile.</p>
      )}

      <div className="flex justify-end border-t border-slate-700/60 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-200">{value ?? '—'}</p>
    </div>
  );
}
