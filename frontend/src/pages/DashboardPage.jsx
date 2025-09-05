// /DaSpCoRate/frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { getCouples } from '../api/client';

function DashboardPage({ onLogout }) {
  const [couples, setCouples] = useState([]); // State für die Liste der Paare
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect wird ausgeführt, nachdem die Komponente zum ersten Mal gerendert wurde
  useEffect(() => {
    const fetchCouples = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getCouples();
        setCouples(data); // Speichere die abgerufenen Paare im State
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCouples();
  }, []); // Das leere Array [] sorgt dafür, dass dieser Effekt nur einmal ausgeführt wird

  const handleLogout = () => {
    // Token aus dem Local Storage entfernen
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    // Die App-Komponente informieren, dass der Logout stattgefunden hat
    onLogout();
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Trainer-Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Registrierte Paare</h2>
        {loading && <p>Lade Paare...</p>}
        {error && <p className="text-red-500">Fehler: {error}</p>}
        {!loading && !error && (
          <ul>
            {couples.length > 0 ? (
              couples.map((couple) => (
                <li key={couple.id} className="border-b py-2">
                  <p className="font-semibold">{couple.mr_first_name} & {couple.mrs_first_name}</p>
                  <p className="text-sm text-gray-600">{couple.start_group} - {couple.start_class}</p>
                </li>
              ))
            ) : (
              <p>Keine Paare gefunden.</p>
            )}
          </ul>
        )}
      </div>
      </main>
    </div>
  );
}

export default DashboardPage;