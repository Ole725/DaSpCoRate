// /DaSpCoRate/frontend/src/pages/SessionsManagementPage.jsx (FINALE KORRIGIERTE VERSION)

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSessions, createSession, updateSession, deleteSession } from '../api/client';
import Modal from '../components/Modal';
import { ClipLoader } from 'react-spinners';
import { FaPlus, FaPlay, FaTrash, FaEdit, FaVideo } from 'react-icons/fa';

function SessionsManagementPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE: ERSTELLEN ---
  const initialSessionData = {
    title: 'Competition Training',
    session_date: '',
    video_url: ''
  };
  const [newSessionData, setNewSessionData] = useState(initialSessionData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- STATE: BEARBEITEN ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSessionData, setEditingSessionData] = useState(null);

  // --- STATE: LÖSCHEN ---
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

  // --- HANDLER: ERSTELLEN ---
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

  // --- HANDLER: BEARBEITEN ---
  const openEditModal = (session) => {
    // Wir kopieren die Daten, damit wir sie bearbeiten können
    setEditingSessionData({
        id: session.id,
        title: session.title,
        session_date: session.session_date, // Format yyyy-mm-dd
        video_url: session.video_url || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSessionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSessionSubmit = async (e) => {
    e.preventDefault();
    try {
        const { id, ...updateData } = editingSessionData;
        await updateSession(id, updateData);
        toast.success('Training aktualisiert!');
        setIsEditModalOpen(false);
        fetchSessions();
    } catch (err) {
        toast.error(err.message);
    }
  };

  // --- HANDLER: LÖSCHEN ---
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

  // Gemeinsame Input-Felder für Modal (Wiederverwendbar)
  const SessionFormFields = ({ data, onChange }) => (
    <>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="title">Titel des Trainings</label>
            <input id="title" name="title" value={data.title} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="session_date">Datum</label>
            <input id="session_date" name="session_date" type="date" value={data.session_date} onChange={onChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2" htmlFor="video_url">Video Link (Optional)</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaVideo className="text-gray-400" />
                </div>
                <input 
                    id="video_url" 
                    name="video_url" 
                    type="url" 
                    placeholder="https://drive.google.com/..." 
                    value={data.video_url} 
                    onChange={onChange} 
                    className="shadow appearance-none border rounded w-full py-2 pl-10 px-3 text-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline" 
                />
            </div>
            <p className="text-xs text-gray-500 mt-1">Hier kannst du einen Link zum aufgezeichneten Training einfügen.</p>
        </div>
    </>
  );

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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        {session.title}
                        {session.video_url && <FaVideo className="text-blue-500" title="Video vorhanden" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.session_date).toLocaleDateString('de-DE')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{new Date(session.created_at).toLocaleString('de-DE')}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-start items-center gap-4">
                         <NavLink to={`/dashboard/sessions/${session.id}`} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"><FaPlay size={12} /><span>Start</span></NavLink>
                         
                         <button onClick={() => openEditModal(session)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"><FaEdit size={12} /><span>Bearbeiten</span></button>
                         
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

      {/* MODAL: ERSTELLEN */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neues Training hinzufügen">
        <form onSubmit={handleAddSessionSubmit}>
          <SessionFormFields data={newSessionData} onChange={handleInputChange} />
          <div className="flex justify-end mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2">Abbrechen</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Speichern</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: BEARBEITEN */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Training bearbeiten">
        {editingSessionData && (
            <form onSubmit={handleEditSessionSubmit}>
            <SessionFormFields data={editingSessionData} onChange={handleEditInputChange} />
            <div className="flex justify-end mt-6">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2">Abbrechen</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Aktualisieren</button>
            </div>
            </form>
        )}
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Session löschen">
        <div>
          <p>Möchtest du das Training <span className="font-bold">"{sessionToDelete?.title}"</span> wirklich endgültig löschen?</p>
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