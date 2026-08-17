import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/appointment-requests': 'Appointment Requests',
  '/prescriptions': 'Prescriptions',
  '/reports': 'Medical Reports',
  '/patient': 'Patient Dashboard',
  '/patient/appointments': 'My Appointments',
  '/patient/prescriptions': 'My Prescriptions',
  '/patient/reports': 'My Reports',
  '/patient/profile': 'My Profile',
  '/staff': 'Staff Dashboard',
  '/staff/patients': 'Patient Search',
  '/staff/prescriptions': 'Prescriptions',
  '/staff/reports': 'Reports',
};

export default function Layout({ portal = 'admin' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Clinic Portal';
  const isAdmin = portal === 'admin';

  return (
    <div className={`flex h-screen overflow-hidden bg-surface ${isAdmin ? 'admin-layout' : ''}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} portal={portal} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-64">
        <Navbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          portal={portal}
          showTitle={!isAdmin}
        />

        <main className={`flex-1 overflow-y-auto ${isAdmin ? 'p-6 sm:p-8 lg:p-10' : 'p-4 sm:p-6 lg:p-8'}`}>
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
