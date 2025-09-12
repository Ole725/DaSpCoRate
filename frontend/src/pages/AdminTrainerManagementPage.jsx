// /DaSpCoRate/frontend/src/pages/AdminTrainerManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../api/client';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Modal from '../components/Modal'; // Annahme: Sie haben eine Modal-Komponente

const INITIAL_FORM_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  password: '',
};

function AdminTrainerManagementPage() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null); // null = neu erstellen, sonst Objekt zum Bearbeiten
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            setLoading(true);
            const data = await getTrainers();
            setTrainers(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (trainer = null) => {
        setEditingTrainer(trainer);
        if (trainer) {
            setFormData({
                first_name: trainer.first_name,
                last_name: trainer.last_name,
                email: trainer.email,
                phone_number: trainer.phone_number || '',
                password: '', // Passwortfeld beim Bearbeiten immer leer lassen
            });
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTrainer(null);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Speichere Trainer...');
        try {
            if (editingTrainer) {
                // Update Logik
                const updatedData = { ...formData };
                if (!updatedData.password) {
                    delete updatedData.password; // Kein leeres Passwort senden
                }
                const updatedTrainer = await updateTrainer(editingTrainer.id, updatedData);
                setTrainers(trainers.map(t => t.id === editingTrainer.id ? updatedTrainer : t));
                toast.success('Trainer erfolgreich aktualisiert', { id: toastId });
            } else {
                // Create Logik
                const newTrainer = await createTrainer(formData);
                setTrainers([...trainers, newTrainer]);
                toast.success('Trainer erfolgreich erstellt', { id: toastId });
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    const handleDelete = async (trainerId) => {
        if (window.confirm("Sind Sie sicher, dass Sie diesen Trainer dauerhaft löschen möchten?")) {
            const toastId = toast.loading('Lösche Trainer...');
            try {
                await deleteTrainer(trainerId);
                setTrainers(trainers.filter(t => t.id !== trainerId));
                toast.success("Trainer erfolgreich gelöscht", { id: toastId });
            } catch (error) {
                toast.error(error.message, { id: toastId });
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><ClipLoader color={"#4f46e5"} size={50} /></div>;
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Trainer verwalten</h1>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
                    <FaPlus className="mr-2" /> Trainer anlegen
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">E-Mail</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {trainers.map((trainer) => (
                            <tr key={trainer.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{trainer.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{trainer.first_name} {trainer.last_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{trainer.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(trainer)} className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 mr-4 transition-colors"><FaEdit size={18} /></button>
                                    <button onClick={() => handleDelete(trainer.id)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"><FaTrash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {trainers.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">Keine Trainer gefunden.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTrainer ? "Trainer bearbeiten" : "Neuen Trainer anlegen"}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Vorname" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Nachname" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-Mail" required className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Telefonnummer (optional)" className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={editingTrainer ? "Neues Passwort (leer lassen für keine Änderung)" : "Passwort"} required={!editingTrainer} className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="mr-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Abbrechen</button>
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Speichern</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default AdminTrainerManagementPage;