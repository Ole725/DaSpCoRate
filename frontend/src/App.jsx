// /DaSpCoRate/frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext'; // Nur für die Root-Route

// Importiere unsere Komponenten und Seiten
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import CouplesManagementPage from './pages/CouplesManagementPage';
import SessionsManagementPage from './pages/SessionsManagementPage';
import SessionDetailPage from './pages/SessionDetailPage';
import CoupleDashboardPage from './pages/CoupleDashboardPage';
import CoupleHistoryPage from './pages/CoupleHistoryPage';
import CoupleLayout from './components/CoupleLayout';
import ProfilePage from './pages/ProfilePage';
import PublicLayout from './components/PublicLayout';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import ContactPage from './pages/ContactPage';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
    <Routes>
      {/* Route für die Login-Seite */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
      />

      {/* Eine Layout-Route für alle öffentlichen Seiten */}
        <Route element={<PublicLayout />}>
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

      {/* Geschützte Trainer-Routen */}
      <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="couples" element={<CouplesManagementPage />} />
          <Route path="sessions" element={<SessionsManagementPage />} />
          <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Geschützte Paar-Routen */}
      <Route element={<ProtectedRoute allowedRoles={['couple']} />}>
        <Route path="/couple-dashboard" element={<CoupleLayout />}>
          <Route index element={<CoupleDashboardPage />} /> {/* Hauptseite */}
          <Route path="history" element={<CoupleHistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      {/* Root-Route, die zur richtigen Startseite weiterleitet */}
      <Route
        path="/"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : user?.role === 'trainer' ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/couple-dashboard" />
          )
        }
      />
      
      {/* Not Found Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
          <Toaster
        position="top-right" // Position (andere Optionen: 'top-center', 'bottom-right' etc.)
        toastOptions={{
          // Standard-Optionen für alle Toasts
          duration: 5000, // 5 Sekunden sichtbar
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;