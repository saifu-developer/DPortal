import { usePortalAuth } from '../../context/AuthContext';
import ClinicLogo from '../common/ClinicLogo';

const portalLabels = {
  admin: 'Doctor Portal',
  patient: 'Patient Portal',
  staff: 'Staff Portal',
};

export default function Navbar({ title, onMenuClick, portal = 'admin', showTitle = true }) {
  const portalAuth = usePortalAuth(portal);
  const isAdmin = portal === 'admin';

  const displayName = portalAuth?.fullName || portalLabels[portal];
  const roleLabel = portal === 'admin' ? 'Doctor' : portal === 'patient' ? 'Patient' : 'Staff';
  const initial =
    portalAuth?.fullName?.charAt(0)?.toUpperCase() ||
    (portal === 'staff' ? 'S' : portal === 'patient' ? 'P' : 'D');

  return (
    <header
      className={`sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-700/60 bg-surface/95 backdrop-blur-md ${
        isAdmin ? 'h-20 px-6 sm:px-8 lg:px-10' : 'h-16 px-4 sm:px-6 lg:px-8'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-surface-overlay hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isAdmin ? (
          <div className="hidden min-w-0 items-center gap-3 sm:flex">
            <ClinicLogo className="h-9 w-auto" />
            <div>
              <p className="text-sm font-semibold text-white">KurePulse Clinic</p>
              <p className="text-xs text-slate-500">Doctor Portal</p>
            </div>
          </div>
        ) : (
          showTitle && (
            <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h1>
          )
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {isAdmin && (
          <button
            type="button"
            className="btn-icon relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
        )}

        <div className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-surface-raised px-3 py-2 sm:gap-4 sm:px-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-100">{displayName}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent ring-2 ring-accent/20"
            title={`${displayName} (${roleLabel})`}
          >
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
