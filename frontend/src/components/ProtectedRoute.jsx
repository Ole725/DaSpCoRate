// /DaSpCoRate/frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

// Diese Komponente nimmt eine andere Komponente als "children" entgegen
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Wenn kein Token vorhanden ist, leite zur Login-Seite weiter
    return <Navigate to="/login" replace />;
  }

  // Wenn ein Token vorhanden ist, rendere die "children"-Komponente (z.B. das Dashboard)
  return children;
}

export default ProtectedRoute;