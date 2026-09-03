import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { AnimatedLink } from '../motion';
import { CLINIC_NAME } from '../../constants/clinic';
import ClinicLogo from '../common/ClinicLogo';
import { PATIENT_LOGIN_URL } from '../../config/portalConfig';

const handlePatientPortalClick = (event) => {
  if (!PATIENT_LOGIN_URL) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  window.location.assign(PATIENT_LOGIN_URL);
};

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Doctor', path: '/about' },
  { label: 'Treatments', path: '/treatments' },
  { label: 'Contact', path: '/contact' },
  { label: 'Book Appointment', path: '/book-appointment' },
];

function NavItem({ link }) {
  return (
    <NavLink
      to={link.path}
      end={link.path === '/'}
      className={({ isActive }) =>
        `relative rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? 'text-medical-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-indicator"
              className="absolute inset-0 rounded-full bg-medical-50"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          {link.label}
        </>
      )}
    </NavLink>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-slate-100/80"
      animate={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(12px)',
        boxShadow: scrolled ? '0 4px 24px -4px rgba(15, 23, 42, 0.08)' : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="container-custom flex h-16 items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-2.5">
          <ClinicLogo className="h-10 w-auto sm:h-11" />
          <div className="sr-only">
            <p className="font-display text-lg font-bold text-slate-900">{CLINIC_NAME}</p>
            <p className="text-xs text-medical-600">Medical Clinic</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavItem key={link.path} link={link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={PATIENT_LOGIN_URL || '#'}
            onClick={handlePatientPortalClick}
            className="btn-outline text-sm"
          >
            Patient Portal
          </a>
          <AnimatedLink to="/book-appointment" className="btn-primary text-sm">
            Book Now
          </AnimatedLink>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden border-t border-slate-100 bg-white lg:hidden"
      >
        <div className="px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-medical-50 text-medical-700' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={PATIENT_LOGIN_URL || '#'}
              onClick={(event) => {
                handlePatientPortalClick(event);
                setMenuOpen(false);
              }}
              className="rounded-lg px-4 py-3 text-sm font-medium text-medical-700"
            >
              Patient Portal
            </a>
          </nav>
        </div>
      </motion.div>
    </motion.header>
  );
}
