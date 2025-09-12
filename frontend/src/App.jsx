// /DaSpCoRate/frontend/src/App.jsx (FINALE, SAUBERE VERSION)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import DashboardLayout from './components/DashboardLayout';
import CoupleLayout from './components/CoupleLayout';
import PublicLayout from './components/PublicLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import CouplesManagementPage from './pages/CouplesManagementPage';
import SessionsManagementPage from './pages/SessionsManagementPage';
import SessionDetailPage from './pages/SessionDetailPage';
import CoupleDashboardPage from './pages/CoupleDashboardPage';
import CoupleHistoryPage from './pages/CoupleHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminTrainerManagementPage from './pages/AdminTrainerManagementPage'; 
import AdminCouplesManagementPage from './pages/AdminCouplesManagementPage';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Lade Anwendung...</div>; 
  }

  return (
    <div>
    <Routes>
      {/* Route für die Login-Seite: Leitet eingeloggte Nutzer sofort weg */}
      <Route path="/login" element={<LoginPage />} />
      {/* Öffentliche Seiten für Impressum etc. */}
      <Route element={<PublicLayout />}>
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* --- GESCHÜTZTE BEREICHE --- */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
         <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="trainers" element={<AdminTrainerManagementPage />} />
          <Route path="couples" element={<AdminCouplesManagementPage />} />
        </Route>
      </Route>


      <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} />
          <Route path="couples" element={<CouplesManagementPage />} />
          <Route path="sessions" element={<SessionsManagementPage />} />
          <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['couple']} />}>
        <Route path="/couple-dashboard" element={<CoupleLayout />}>
          <Route index element={<CoupleDashboardPage />} />
          <Route path="history" element={<CoupleHistoryPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      {/* --- DIE EINE, WAHRE ROOT-ROUTE --- */}
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            user.role === 'admin'   ? <Navigate to="/admin" replace /> :
            user.role === 'trainer' ? <Navigate to="/dashboard" replace /> :
            <Navigate to="/couple-dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Not Found Route: Leitet alle unbekannten Pfade zur Root-Route um */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Toaster /* ... */ />
    </div>
  );
}

export default App;