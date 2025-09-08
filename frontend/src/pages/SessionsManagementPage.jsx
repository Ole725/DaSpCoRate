// /DaSpCoRate/frontend/src/pages/SessionsManagementPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSessions, createSession, deleteSession } from '../api/client';
import Modal from '../components/Modal';

function SessionsManagementPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State für das Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    session_date: '', // Format: YYYY-MM-DD
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  // Funktion zum Abrufen der Sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      toast.error(`Fehler beim Laden der Sessions: ${err.message}`);
    } finally {
      setLoading(false);
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
      toast.success('Session erfolgreich hinzugefügt!');
      setIsModalOpen(false); // Schließe das Modal bei Erfolg
      setNewSessionData({ title: '', session_date: '' }); // Formular zurücksetzen
      fetchSessions(); // Lade die Session-Liste neu
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handler für den Lösch-Workflow
  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSession(sessionToDelete.id);
      toast.success(`Session "${sessionToDelete.title}" wurde gelöscht.`);
      fetchSessions(); // Liste neu laden
    } catch (err) {
      toast.error(`Fehler beim Löschen: ${err.message}`);
    } finally {
      closeDeleteModal(); // Modal immer schließen
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
                        Start
                      </Link>
                      <button onClick={() => openDeleteModal(session)} className="text-red-600 hover:text-red-900">
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
      {/* Modal zum Bestätigen des Löschens */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Session löschen"
      >
       <div>
          <p>
            Möchtest du die Session <span className="font-bold">"{sessionToDelete?.title}"</span> wirklich endgültig löschen? Alle zugehörigen Anmeldungen und Bewertungen gehen dabei verloren.
         </p>
         <div className="flex justify-end mt-6 space-x-4">
            <button
             onClick={closeDeleteModal}
             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Abbrechen
            </button>
           <button
             onClick={handleDeleteConfirm}
             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
           >
             Löschen
           </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SessionsManagementPage;