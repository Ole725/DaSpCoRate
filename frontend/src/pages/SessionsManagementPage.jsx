// /DaSpCoRate/frontend/src/pages/SessionsManagementPage.jsx (FINALE KORRIGIERTE VERSION)

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSessions, createSession, deleteSession } from '../api/client';
import Modal from '../components/Modal';
import { ClipLoader } from 'react-spinners';
import { FaPlus, FaPlay, FaTrash } from 'react-icons/fa';

function SessionsManagementPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const initialSessionData = {
    title: 'Competition Training',
    session_date: '',
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
      toast.error(`Fehler beim Laden der Trainings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const openAddModal = () => {
    setNewSessionData(initialSessionData);
    setIsModalOpen(true);
  };
  
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
      fetchSessions();
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const openDeleteModal = (session) => { setSessionToDelete(session); setIsDeleteModalOpen(true); };
  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setSessionToDelete(null); };
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingSessions = sessions.filter(s => new Date(s.session_date) >= today).sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  const pastSessions = sessions.filter(s => new Date(s.session_date) < today).sort((a, b) => new Date(b.session_date) - new Date(a.session_date));

  if (loading) {
    return <div className="flex justify-center items-center h-64"><ClipLoader color={"#3b82f6"} size={50} /></div>;
  }

  const SessionTable = ({ sessionList, title }) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
      {sessionList.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Erstellt am</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {sessionList.map((session) => (
                <React.Fragment key={session.id}>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{session.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.session_date).toLocaleDateString('de-DE')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.created_at).toLocaleString('de-DE')}</td>
                  </tr>
                  <tr>
                    {/* HIER IST DIE WICHTIGE KORREKTUR: colSpan="3" */}
                    <td colSpan="3" className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-start items-center gap-4">
                         <NavLink to={`/dashboard/sessions/${session.id}`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"><FaPlay size={12} /><span>Start</span></NavLink>
                         <button onClick={() => openDeleteModal(session)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"><FaTrash size={12} /><span>Löschen</span></button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
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
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Trainings-Verwaltung</h2>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"><FaPlus /><span>Training hinzufügen</span></button>
        </div>
        <SessionTable sessionList={upcomingSessions} title="Anstehende Trainings" />
        <SessionTable sessionList={pastSessions} title="Vergangene Trainings" />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neues Training hinzufügen">
        <form onSubmit={handleAddSessionSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="title">Titel des Trainings</label>
            <input id="title" name="title" value={newSessionData.title} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="session_date">Datum</label>
            <input id="session_date" name="session_date" type="date" value={newSessionData.session_date} onChange={handleInputChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2">Abbrechen</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Speichern</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Session löschen">
        <div>
          <p>Möchtest du das Training <span className="font-bold">"{sessionToDelete?.title}"</span> wirklich endgültig löschen? Alle zugehörigen Anmeldungen und Bewertungen gehen dabei verloren.</p>
         <div className="flex justify-end mt-6 space-x-4">
            <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400">Abbrechen</button>
           <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Löschen</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SessionsManagementPage;