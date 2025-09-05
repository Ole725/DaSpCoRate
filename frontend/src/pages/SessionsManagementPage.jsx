// /DaSpCoRate/frontend/src/pages/SessionsManagementPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSessions, createSession, deleteSession } from '../api/client';
import Modal from '../components/Modal';

function SessionsManagementPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State für das Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    session_date: '', // Format: YYYY-MM-DD
  });

  // Funktion zum Abrufen der Sessions
  const fetchSessions = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteSession = async (sessionId) => {
    // Bestätigungsdialog (ersetzt confirm(), wie im PRD gefordert)
    // Für den Moment verwenden wir window.confirm, später ersetzen wir es durch ein Modal.
    if (window.confirm('Sind Sie sicher, dass Sie diese Session löschen möchten?')) {
      try {
        await deleteSession(sessionId);
        // Lade die Session-Liste neu, um die gelöschte Session zu entfernen
        fetchSessions(); 
      } catch (err) {
        alert(`Fehler beim Löschen: ${err.message}`);
      }
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSessionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSession(newSessionData);
      setIsModalOpen(false); // Schließe das Modal bei Erfolg
      setNewSessionData({ title: '', session_date: '' }); // Formular zurücksetzen
      fetchSessions(); // Lade die Session-Liste neu
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Session-Verwaltung</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Session hinzufügen
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading && <p>Lade Sessions...</p>}
          {error && <p className="text-red-500">Fehler: {error}</p>}
          {!loading && !error && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Erstellt am</th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Aktionen</span>
                 </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{session.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(session.session_date).toLocaleDateString('de-DE')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(session.created_at).toLocaleString('de-DE')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4"> {/* NEU: Flex-Container */}
                      <Link to={`/dashboard/sessions/${session.id}`} className="text-indigo-600 hover:text-indigo-900">
                        Details
                      </Link>
                     <button onClick={() => handleDeleteSession(session.id)} className="text-red-600 hover:text-red-900"> {/* NEU: Button mit Funktion */}
                        Löschen
                      </button>
                    </div>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Neue Session hinzufügen"
      >
        <form onSubmit={handleAddSessionSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Titel der Session
            </label>
            <input
              id="title"
              name="title"
              value={newSessionData.title}
              onChange={handleInputChange}
              placeholder="z.B. Standard Workshop"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="session_date">
              Datum
            </label>
            <input
              id="session_date"
              name="session_date"
              type="date"
              value={newSessionData.session_date}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          
          <div className="flex justify-end mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
              Abbrechen
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Speichern
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default SessionsManagementPage;