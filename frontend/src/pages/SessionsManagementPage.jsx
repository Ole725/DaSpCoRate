// /DaSpCoRate/frontend/src/pages/SessionsManagementPage.jsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSessions, createSession, deleteSession } from '../api/client';
import Modal from '../components/Modal';
import { ClipLoader } from 'react-spinners';
import { ALL_CRITERIA, ALL_CRITERIA_KEYS } from '../lib/criteria';
import { useTheme } from '../context/ThemeContext';

function SessionsManagementPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // States for modals remain unchanged
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialSessionData = {
    title: 'Competition Training',
    session_date: '',
    criteria: ALL_CRITERIA_KEYS
  };

  const [newSessionData, setNewSessionData] = useState(initialSessionData);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      toast.error(`Fehler beim Laden des Trainings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openAddModal = () => {
    setNewSessionData(initialSessionData); // Setzt das Formular zurück
    setIsModalOpen(true);                  // Öffnet das Modal
  };
  
  // Handler zum Umschalten der Kriterien-Auswahl
  const handleCriteriaToggle = (criterionKey) => {
    setNewSessionData(prevData => {
      const currentCriteria = prevData.criteria;
      // Prüfe, ob das Kriterium bereits ausgewählt ist
      if (currentCriteria.includes(criterionKey)) {
        // Wenn ja, entferne es (aber nur, wenn es nicht das letzte ist)
        if (currentCriteria.length > 1) {
          return { ...prevData, criteria: currentCriteria.filter(key => key !== criterionKey) };
        } else {
          toast.error('Es muss mindestens ein Kriterium ausgewählt sein.');
          return prevData;
        }
      } else {
        // Wenn nein, füge es hinzu
        return { ...prevData, criteria: [...currentCriteria, criterionKey] };
      }
    });
  };

  // Handlers for input, submit, and modals remain unchanged
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSessionData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSession(newSessionData);
      toast.success('Training erfolgreich hinzugefügt!');
      setIsModalOpen(false);
      setNewSessionData(initialSessionData);
      fetchSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };
  
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
      fetchSessions();
    } catch (err) {
      toast.error(`Fehler beim Löschen: ${err.message}`);
    } finally {
      closeDeleteModal();
    }
  };

  // Logik zum Aufteilen und Sortieren der Sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Wichtig: Zeit entfernen für einen sauberen Datumsvergleich

  const upcomingSessions = sessions
    .filter(s => new Date(s.session_date) >= today)
    .sort((a, b) => new Date(a.session_date) - new Date(b.session_date)); // Aufsteigend sortieren

  const pastSessions = sessions
    .filter(s => new Date(s.session_date) < today)
    .sort((a, b) => new Date(b.session_date) - new Date(a.session_date)); // Absteigend sortieren


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#3b82f6"} loading={loading} size={50} />
      </div>
    );
  }

  // Eine wiederverwendbare Tabellenkomponente innerhalb dieser Datei
  const SessionTable = ({ sessionList, title }) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
      {sessionList.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Erstellt am</th>
                <th className="relative px-6 py-3"><span className="sr-only">Aktionen</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sessionList.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{session.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.session_date).toLocaleDateString('de-DE')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.created_at).toLocaleString('de-DE')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-4">
                      <NavLink to={`/dashboard/sessions/${session.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900">Start</NavLink>
                      <button onClick={() => openDeleteModal(session)} className="text-red-600 dark:text-red-400 hover:text-red-900">Löschen</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">Kein Training in dieser Kategorie.</p>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Trainings-Verwaltung</h2>
          <button
            onClick={openAddModal}
            className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            + Training hinzufügen
          </button>
        </div>
        
        {/* Angepasste JSX-Struktur mit zwei Tabellen */}
        <SessionTable sessionList={upcomingSessions} title="Anstehende Trainings" />
        <SessionTable sessionList={pastSessions} title="Vergangene Trainings" />

      </div>

      {/* Modals for adding and deleting sessions remain unchanged */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neues Training hinzufügen">
        <form onSubmit={handleAddSessionSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="title">
              Titel des Trainings
            </label>
            <input
              id="title"
              name="title"
              value={newSessionData.title}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="session_date">
              Datum
            </label>
            <input
              id="session_date"
              name="session_date"
              type="date"
              value={newSessionData.session_date}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2">
              Wertungskriterien für dieses Training
            </label>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              {ALL_CRITERIA.map(criterion => (
                <button
                  type="button"
                  key={criterion.key}
                  onClick={() => handleCriteriaToggle(criterion.key)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    newSessionData.criteria.includes(criterion.key)
                      ? 'bg-blue-600 dark:bg-blue-700 text-white font-semibold'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                >
                  {criterion.abbr}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-400 font-bold py-2 px-4 rounded mr-2"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white dark:text-gray-400 font-bold py-2 px-4 rounded"
            >
              Speichern
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Session löschen">
        {/* ... delete confirmation content ... */}
        <div>
          <p>
            Möchtest du das Training <span className="font-bold">"{sessionToDelete?.title}"</span> wirklich endgültig löschen? Alle zugehörigen Anmeldungen und Bewertungen gehen dabei verloren.
         </p>
         <div className="flex justify-end mt-6 space-x-4">
            <button
             onClick={closeDeleteModal}
             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Abbrechen
            </button>
           <button
             onClick={handleDeleteConfirm}
             className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
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