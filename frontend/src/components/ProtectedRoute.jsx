// /DaSpCoRate/frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wenn die Rolle des Benutzers nicht in den erlaubten Rollen enthalten ist
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Leite zu einer "Nicht autorisiert"-Seite weiter
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />;
}
export default ProtectedRoute;