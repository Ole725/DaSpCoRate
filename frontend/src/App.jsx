// /DaSpCoRate/frontend/src/App.jsx (FINALE, SAUBERE VERSION)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layouts
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import DashboardLayout from './components/DashboardLayout';
import CoupleLayout from './components/CoupleLayout';
import PublicLayout from './components/PublicLayout';

// Pages
import ConsentPage from './pages/ConsentPage';
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
import CouplesRatingPage from './pages/CouplesRatingPage';
import AdminConsentPage from './pages/AdminConsentPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300">Lade Anwendung...</div>
      </div>
    ); 
  }

  return (
    <div>
      <Routes>
        
        {/* 1. Login steht alleine (bringt eigenes Layout mit) */}
        <Route path="/login" element={<LoginPage />} />

        {/* 2. Öffentliche Seiten GRUPPIERT unter PublicLayout (Nutzung von Outlet) */}
        <Route element={<PublicLayout />}>
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/consent" element={<ConsentPage />} />
        </Route>


        {/* --- ADMIN BEREICH --- */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="trainers" element={<AdminTrainerManagementPage />} />
            <Route path="couples" element={<CouplesManagementPage />} />
            <Route path="wertungen/:coupleId" element={<CouplesRatingPage />} />
            <Route path="consent" element={<AdminConsentPage />} />
          </Route>
        </Route>


        {/* --- TRAINER BEREICH --- */}
        <Route element={<ProtectedRoute allowedRoles={['trainer']} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="couples" element={<CouplesManagementPage />} />
            <Route path="wertungen/:coupleId" element={<CouplesRatingPage />} />
            <Route path="sessions" element={<SessionsManagementPage />} />
            <Route path="sessions/:sessionId" element={<SessionDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>


        {/* --- PAAR BEREICH --- */}
        <Route element={<ProtectedRoute allowedRoles={['couple']} />}>
          <Route path="/couple-dashboard" element={<CoupleLayout />}>
            <Route index element={<CoupleDashboardPage />} />
            <Route path="history" element={<CoupleHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        
        {/* --- INTELLIGENTE ROOT-ROUTE (REDIRECT) --- */}
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
        
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;