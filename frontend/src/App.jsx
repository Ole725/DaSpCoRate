// /DaSpCoRate/frontend/src/App.jsx
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State, um zu prüfen, ob der Benutzer authentifiziert ist
  const [loading, setLoading] = useState(true); // Ladezustand, um Flackern zu vermeiden

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
  };

  // Funktion für den Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Solange wir prüfen, ob ein Token existiert, zeigen wir nichts an
  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Lade...</div>;
  }

  return (
    <div>
      {isAuthenticated ? 
        <DashboardPage onLogout={handleLogout} /> : 
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      }
    </div>
  );
}

export default App;