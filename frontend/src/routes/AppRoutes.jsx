import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import InternalPortal from '../pages/InternalPortal';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Doctors from '../pages/Doctors';
import Appointments from '../pages/Appointments';
import Prescriptions from '../pages/Prescriptions';
import Reports from '../pages/Reports';
import AppointmentRequests from '../pages/AppointmentRequests';
import DoctorLogin from '../pages/doctor/DoctorLogin';
import PatientLogin from '../pages/patient/PatientLogin';
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientAppointments from '../pages/patient/PatientAppointments';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions';
import PatientReports from '../pages/patient/PatientReports';
import PatientProfile from '../pages/patient/PatientProfile';
import StaffLogin from '../pages/staff/StaffLogin';
import StaffDashboard from '../pages/staff/StaffDashboard';
import StaffPatients from '../pages/staff/StaffPatients';
import StaffPrescriptions from '../pages/staff/StaffPrescriptions';
import StaffReports from '../pages/staff/StaffReports';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portal" replace />} />
      <Route path="/portal" element={<InternalPortal />} />

      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/login/patient" element={<PatientLogin />} />
      <Route path="/login/staff" element={<StaffLogin />} />

      <Route
        element={
          <ProtectedRoute role="DOCTOR">
            <Layout portal="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointment-requests" element={<AppointmentRequests />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      <Route
        path="/patient"
        element={
          <ProtectedRoute role="PATIENT">
            <Layout portal="patient" />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute role="STAFF">
            <Layout portal="staff" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatients />} />
        <Route path="prescriptions" element={<StaffPrescriptions />} />
        <Route path="reports" element={<StaffReports />} />
      </Route>

      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
