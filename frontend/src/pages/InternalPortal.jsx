import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import InternalPortalBackground from '../components/login/InternalPortalBackground';
import ClinicLogo from '../components/common/ClinicLogo';
import { CLINIC_FULL_NAME } from '../constants/clinic';

const portals = [
  {
    title: 'Doctor Login',
    description:
      'Manage patients, appointments, prescriptions, and review appointment requests from the public website.',
    loginPath: '/login/doctor',
    buttonLabel: 'Doctor Login',
    accent: 'text-teal-700 bg-teal-100',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    title: 'Staff / Medical Store Login',
    description:
      'Search patients and view prescriptions and reports with secure read-only access for clinic staff.',
    loginPath: '/login/staff',
    buttonLabel: 'Staff Login',
    accent: 'text-sky-700 bg-sky-100',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function InternalPortal() {
  const reducedMotion = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((event) => {
    setMouse({
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    });
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={reducedMotion ? undefined : handleMouseMove}
    >
      <InternalPortalBackground mouse={mouse} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <ClinicLogo className="mx-auto mb-5 h-16 w-auto sm:h-20" alt={`${CLINIC_FULL_NAME} logo`} />
          <h1 className="text-3xl font-bold tracking-tight text-cyan-50 sm:text-4xl">
            {CLINIC_FULL_NAME} Internal Portal
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-300">
            Authorized Access for Clinic Staff
          </p>
        </header>

        <div className="mx-auto grid w-full max-w-3xl gap-6 sm:grid-cols-2">
          {portals.map((portal) => (
            <article
              key={portal.title}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm shadow-slate-200/60 transition hover:border-teal-200 hover:shadow-md"
            >
              <div
                className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${portal.accent}`}
              >
                {portal.icon}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{portal.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{portal.description}</p>
              <Link
                to={portal.loginPath}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700"
              >
                {portal.buttonLabel}
              </Link>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl items-center justify-center gap-3 rounded-xl border border-teal-100 bg-teal-50/80 px-5 py-4 text-sm text-teal-800">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p>This portal is restricted to authorized clinic personnel only.</p>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {CLINIC_FULL_NAME} · Internal Use Only
        </p>
      </div>
    </div>
  );
}
