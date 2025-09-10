// /DaSpCoRate/frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdMan, MdWoman } from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';

function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      // Stelle sicher, dass eine nutzerfreundliche Nachricht angezeigt wird
      setError('E-Mail oder Passwort ist ungültig. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  if (isAuthenticated && user) {
    // Deine bestehende Logik zur Umleitung ist gut, aber wir können sie hier vereinfachen.
    // Die Rolle wird im AuthContext bereits geprüft für die Navigation.
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Eine größere, zweigeteilte Login-Karte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">

        {/* --- Linker Bereich: Branding & Willkommensgruß --- */}
        <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-700 text-white p-12 flex flex-col justify-center items-center text-center">
          <div className="flex items-center justify-center text-6xl mb-4 text-blue-200 gap-1">
            <MdMan />
            <MdWoman />
          </div>
          <h1 className="text-3xl font-bold mb-2">Willkommen bei DaSpCoRate</h1>
          <p className="text-blue-100 mb-6">
            Dein digitaler Begleiter für präzise Tanzsport-Bewertungen.
          </p>
        </div>

        {/* --- Rechter Bereich: Das eigentliche Login-Formular --- */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">Anmelden</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">E-Mail</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Passwort</label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 w-full transition-colors"
              >
                {loading ? 'Anmelden...' : 'Anmelden'}
              </button>
            </div>
            {error && <p className="mt-4 text-center text-red-500 dark:text-red-400 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;