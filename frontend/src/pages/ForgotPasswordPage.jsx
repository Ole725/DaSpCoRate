// /DaSpCoRate/frontend/src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// WICHTIG: Hier importieren wir deinen konfigurierten Client!
import apiClient from '../api/client'; 
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Wir nutzen apiClient statt axios. 
      // Die BaseURL (/api/v1) ist schon drin, also nur noch den Restpfad angeben.
      await apiClient.post(`/auth/password-recovery/${email}`);
      
      setEmailSent(true);
      toast.success('Falls die E-Mail existiert, haben wir einen Link gesendet!');
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schiefgelaufen. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Passwort vergessen?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Gib deine E-Mail-Adresse ein und wir senden dir einen Link zum Zurücksetzen.
          </p>
        </div>

        {!emailSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-Mail Adresse
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="E-Mail Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sende...' : 'Link senden'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">E-Mail gesendet! </strong>
              <span className="block sm:inline">Bitte prüfe deinen Posteingang (und Spam-Ordner).</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Keine E-Mail erhalten? Warte ein paar Minuten oder versuche es erneut.
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Zurück zum Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;