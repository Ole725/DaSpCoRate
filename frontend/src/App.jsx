// /DaSpCoRate/frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// Importiere unsere Komponenten und Seiten
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import CouplesManagementPage from './pages/CouplesManagementPage';
import SessionsManagementPage from './pages/SessionsManagementPage';

function App() {
  // Kein State-Management für Authentifizierung mehr hier!
  // Das übernimmt die ProtectedRoute-Komponente.

  return (
    <Routes>
      {/* Öffentliche Route für die Login-Seite */}
      <Route path="/login" element={<LoginPage />} />

      {/* Geschützte Dashboard-Routen */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Kind-Routen, die im <Outlet> des DashboardLayout gerendert werden */}
        <Route index element={<DashboardOverviewPage />} /> {/* Standard-Route für /dashboard */}
        <Route path="couples" element={<CouplesManagementPage />} />
        <Route path="sessions" element={<SessionsManagementPage />} />
      </Route>
      
      {/* Fallback-Route: Leitet jede unbekannte URL zu /login um */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;