import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { auth } = useAuth();
  const location = useLocation();

  const loginPaths = {
    DOCTOR: '/login/doctor',
    PATIENT: '/login/patient',
    STAFF: '/login/staff',
  };

  if (!auth || (role && auth.role !== role)) {
    const loginPath = loginPaths[role] || '/login/doctor';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}
