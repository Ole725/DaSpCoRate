// /DaSpCoRate/frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // Perfekt für den Ladevorgang
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && allowedRoles) {
    // 1. Bestimme die Rolle des Benutzers robust, genau wie im AuthContext
    const userRole = 'last_name' in user ? 'trainer' : 'couple';

    // 2. Verwende die neu bestimmte Rolle für die Berechtigungsprüfung
    if (!allowedRoles.includes(userRole)) {
      // Wenn die Rolle nicht passt, leite zum EIGENEN Dashboard um
      const redirectTo = userRole === 'trainer' ? '/dashboard' : '/couple-dashboard';
      return <Navigate to={redirectTo} replace />;
    }
  }

  // 4. Wenn alles passt (authentifiziert UND autorisiert), zeige die geschützte Seite.
  // In der v6-Struktur von react-router wird hier der Outlet für die verschachtelten Routen gerendert.
  return <Outlet />;
}

export default ProtectedRoute;