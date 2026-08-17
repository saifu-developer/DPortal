import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth, usePortalAuth } from '../../context/AuthContext';
import ClinicLogo from '../common/ClinicLogo';
import {
  getPendingRequestCount,
  REQUESTS_UPDATED_EVENT,
} from '../../services/appointmentRequestService';

const adminNavItems = [
  { label: 'Dashboard', path: '/dashboard', end: true, icon: 'dashboard' },
  { label: 'Patients', path: '/patients', icon: 'patients' },
  { label: 'Doctors', path: '/doctors', icon: 'doctors' },
  { label: 'Appointments', path: '/appointments', icon: 'appointments' },
  { label: 'Appointment Requests', path: '/appointment-requests', icon: 'requests', showBadge: true },
  { label: 'Prescriptions', path: '/prescriptions', icon: 'prescriptions' },
  { label: 'Reports', path: '/reports', icon: 'reports' },
];

const patientNavItems = [
  { label: 'Dashboard', path: '/patient', end: true, icon: 'dashboard' },
  { label: 'My Appointments', path: '/patient/appointments', icon: 'appointments' },
  { label: 'My Prescriptions', path: '/patient/prescriptions', icon: 'prescriptions' },
  { label: 'My Reports', path: '/patient/reports', icon: 'reports' },
  { label: 'My Profile', path: '/patient/profile', icon: 'patients' },
];

const staffNavItems = [
  { label: 'Dashboard', path: '/staff', end: true, icon: 'dashboard' },
  { label: 'Patient Search', path: '/staff/patients', icon: 'patients' },
  { label: 'Prescriptions', path: '/staff/prescriptions', icon: 'prescriptions' },
  { label: 'Reports', path: '/staff/reports', icon: 'reports' },
];

const icons = {
  dashboard: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  patients: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  doctors: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  appointments: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  requests: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  prescriptions: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  reports: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
};

const portalConfig = {
  admin: { items: adminNavItems, title: 'Clinic Portal', subtitle: 'Doctor / Admin' },
  patient: { items: patientNavItems, title: 'Patient Portal', subtitle: 'My Health' },
  staff: { items: staffNavItems, title: 'Staff Portal', subtitle: 'Read-only Access' },
};

export default function Sidebar({ isOpen, onClose, portal = 'admin' }) {
  const { logout } = useAuth();
  const portalAuth = usePortalAuth(portal);
  const navigate = useNavigate();
  const config = portalConfig[portal] || portalConfig.admin;
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPending = async () => {
    if (portal !== 'admin') return;
    try {
      const res = await getPendingRequestCount();
      setPendingCount(res.data ?? 0);
    } catch {
      setPendingCount(0);
    }
  };

  useEffect(() => {
    fetchPending();
    const handler = () => fetchPending();
    window.addEventListener(REQUESTS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(REQUESTS_UPDATED_EVENT, handler);
  }, [portal]);

  const handleLogout = () => {
    logout();
    const paths = { patient: '/login/patient', staff: '/login/staff', admin: '/login/doctor' };
    navigate(paths[portal] || '/login/doctor');
    onClose?.();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-700/60 bg-surface-raised transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${portal === 'admin' ? 'admin-sidebar' : ''}`}
      >
        <div className={`flex shrink-0 items-center gap-3 border-b border-slate-700/60 ${portal === 'admin' ? 'h-20 px-5' : 'h-16 px-6'}`}>
          <ClinicLogo className="h-9 w-auto shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">{config.title}</p>
            <p className="text-xs text-slate-400">{config.subtitle}</p>
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto ${portal === 'admin' ? 'space-y-1.5 p-4' : 'space-y-1 p-4'}`}>
          {config.items.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} onClick={onClose}>
              {({ isActive }) => (
                <span
                  className={`group relative flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent/15 text-accent shadow-sm shadow-accent/5'
                      : 'text-slate-400 hover:bg-surface-overlay hover:text-slate-200'
                  }`}
                >
                  {isActive && portal === 'admin' && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
                  )}
                  <span className="flex min-w-0 items-center gap-3 pl-1">
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                      {icons[item.icon]}
                    </span>
                    <span className="truncate">
                      {item.showBadge && pendingCount > 0 && portal !== 'admin'
                        ? `${item.label} (${pendingCount})`
                        : item.label}
                    </span>
                  </span>
                  {item.showBadge && pendingCount > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                      {pendingCount}
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`shrink-0 space-y-3 border-t border-slate-700/60 ${portal === 'admin' ? 'p-5' : 'p-4'}`}>
          {portalAuth && (
            <button type="button" onClick={handleLogout} className="btn-secondary w-full text-sm">
              Logout
            </button>
          )}
          {portal === 'admin' && (
            <NavLink to="/portal" className="block text-xs text-accent hover:underline">
              Internal Portal
            </NavLink>
          )}
          <p className="text-xs text-slate-500">© 2026 Clinic Portal</p>
        </div>
      </aside>
    </>
  );
}
