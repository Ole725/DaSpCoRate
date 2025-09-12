// /DaSpCoRate/frontend/src/components/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // 1. Warten, bis der Authentifizierungsstatus klar ist.
  if (loading) {
    // Zeigt eine leere Seite, während der Benutzerstatus geprüft wird.
    // Verhindert ein kurzes Aufblitzen der Login-Seite.
    return <div>Lade...</div>; 
  }

  // 2. Wenn nicht authentifiziert, immer zur Login-Seite schicken.
  if (!isAuthenticated) {
    // Speichert die ursprüngliche Ziel-URL, um nach dem Login dorthin zurückzukehren.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Wenn authentifiziert, prüfen, ob die Rolle passt.
  // Wir verwenden direkt user.role - die einzige Quelle der Wahrheit.
  if (user && !allowedRoles.includes(user.role)) {
    // Der Benutzer hat nicht die erforderliche Rolle.
    // Leite ihn zur Haupt-URL ("/"). Die Logik in App.jsx wird ihn
    // dann automatisch zu seinem korrekten Dashboard weiterleiten.
    // Dies ist robuster als hier erneut die Rolle zu prüfen.
    return <Navigate to="/" replace />;
  }

  // 4. Wenn alles passt (authentifiziert UND autorisiert), zeige die geschützte Seite.
  return <Outlet />;
}

export default ProtectedRoute;