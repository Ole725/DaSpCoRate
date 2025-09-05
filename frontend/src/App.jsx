// /DaSpCoRate/frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State, um zu prüfen, ob der Benutzer authentifiziert ist
  const [loading, setLoading] = useState(true); // Ladezustand, um Flackern zu vermeiden
  const navigate = useNavigate(); // Hook, um programmatisch zu navigieren

  // Beim ersten Laden der App prüfen, ob ein Token vorhanden ist
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false); // Ladezustand beenden
  }, []);

  // Funktion, die an die LoginPage übergeben wird
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    // Nach erfolgreichem Login zum Dashboard navigieren
    navigate('/dashboard');
  };

  // Funktion für den Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    // Nach dem Logout zur Login-Seite navigieren
    navigate('/login');
  };

  // Solange wir prüfen, ob ein Token existiert, zeigen wir nichts an
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Lade...</div>;
  }

  return (
    <Routes>
      {/* Öffentliche Route für die Login-Seite */}
      <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

      {/* Geschützte Route für das Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <DashboardPage onLogout={handleLogout} />
          ) : (
            // Wenn nicht authentifiziert, leite zur Login-Seite weiter
            // Wir werden dies später durch eine "Protected Route"-Komponente sauberer machen
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        } 
      />
      
      {/* Fallback-Route: Wenn keine andere Route passt, leite zum Login oder Dashboard */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            <DashboardPage onLogout={handleLogout} /> 
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        } 
      />
    </Routes>
  );
}

export default App;