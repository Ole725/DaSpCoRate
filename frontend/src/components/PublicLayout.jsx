import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

function PublicLayout() {
  const { isAuthenticated, user } = useAuth();

  // Bestimme, wohin der "Zurück"-Button führen soll
  let backLink = '/login';
  let backText = 'Zurück zum Login';

  if (isAuthenticated && user) {
    backLink = user.role === 'trainer' ? '/dashboard' : '/couple-dashboard';
    backText = 'Zurück zum Dashboard';
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            <Link to="/">DaSpCoRate</Link>
          </h1>
          <Link
            to={backLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors"
          >
            <FaArrowLeft />
            {backText}
          </Link>
        </div>
      </header>
      
      {/* Die Outlet-Komponente rendert hier die jeweilige öffentliche Seite (Impressum, Datenschutz) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;