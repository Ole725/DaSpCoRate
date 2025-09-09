// /DaSpCoRate/frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// WICHTIG: loginUser wird hier NICHT MEHR importiert!

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
      // KORREKTUR: Wir rufen NUR die login-Funktion aus dem Context auf
      // und übergeben ihr die Rohdaten. Der Context erledigt den Rest.
      await login(email, password);
      // Wir müssen hier nicht mehr tun. Der Context leitet uns weiter.
    } catch (err) {
      setError(err.message);
      setLoading(false); // Nur im Fehlerfall das Laden beenden
    }
  };

  // Diese Logik ist perfekt und bleibt unverändert.
  if (isAuthenticated) {
    const targetPath = user.role === 'trainer' ? '/dashboard' : '/couple-dashboard';
    return <Navigate to={targetPath} replace />;
  }

  // Das Formular bleibt unverändert.
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (der Rest des JSX bleibt exakt gleich) ... */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">E-Mail</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Passwort</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 w-full">
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </div>
          {error && <p className="mt-4 text-center text-red-500 text-xs">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;