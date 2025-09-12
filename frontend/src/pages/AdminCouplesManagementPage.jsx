// /DaSpCoRate/frontend/src/pages/AdminCouplesManagementPage.jsx (VERSION MIT DROPDOWNS)

import React, { useState, useEffect } from 'react';
import { getCouples, createCouple, updateCouple, deleteCouple } from '../api/client';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Modal from '../components/Modal';

// 1. DATEN-ARRAYS FÜR DIE DROPDOWNS HINZUFÜGEN
const START_GROUPS = [
  { value: 'Mas IV', label: 'Masters IV (Mas IV)' },
  { value: 'Mas III', label: 'Masters III (Mas III)' },
  { value: 'Mas II', label: 'Masters II (Mas II)' },
  { value: 'Hgr II', label: 'Hauptgruppe II (Hgr II)' },
  { value: 'Hgr', label: 'Hauptgruppe (Hgr)' },
  { value: 'Jug', label: 'Jugend (Jug)' },
  { value: 'Mas I', label: 'Masters I (Mas I)' },
  { value: 'Jun II', label: 'Junioren II (Jun II)' },
  { value: 'Jun I', label: 'Junioren I (Jun I)' },
  { value: 'Kin II', label: 'Kinder II (Kin II)' },
  { value: 'Kin I', label: 'Kinder I (Kin I)' },
];

const START_CLASSES = [
  { value: 'S', label: 'S' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
  { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'E', label: 'E' },
];

const DANCE_STYLES = [
  { value: 'Std', label: 'Standard (Std)' },
  { value: 'Lat', label: 'Latein (Lat)' },
  { value: 'Std & Lat', label: 'Standard & Latein (Std & Lat)' },
];

// INITIAL_FORM_STATE anpassen, um gute Default-Werte zu haben
const INITIAL_FORM_STATE = {
  mr_first_name: '',
  mrs_first_name: '',
  email: '',
  phone_number: '',
  start_group: 'Hgr', // Sinnvoller Default
  start_class: 'D', // Sinnvoller Default
  dance_style: 'Standard', // Sinnvoller Default
  password: '',
};

function AdminCouplesManagementPage() {
    const [couples, setCouples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCouple, setEditingCouple] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);

    // ... (alle Funktionen von useEffect bis handleDelete bleiben exakt gleich wie in Ihrer letzten Version) ...
    useEffect(() => {
        fetchCouples();
    }, []);

    const fetchCouples = async () => {
        try {
            setLoading(true);
            const data = await getCouples();
            setCouples(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (couple = null) => {
        setEditingCouple(couple);
        if (couple) {
            setFormData({
                mr_first_name: couple.mr_first_name,
                mrs_first_name: couple.mrs_first_name,
                email: couple.email,
                phone_number: couple.phone_number || '',
                start_group: couple.start_group,
                start_class: couple.start_class,
                dance_style: couple.dance_style,
                password: '',
            });
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCouple(null);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Speichere Paar...');
        try {
            if (editingCouple) {
                const updatedData = { ...formData };
                if (!updatedData.password) {
                    delete updatedData.password;
                }
                const updatedCouple = await updateCouple(editingCouple.id, updatedData);
                setCouples(couples.map(c => c.id === editingCouple.id ? updatedCouple : c));
                toast.success('Paar erfolgreich aktualisiert', { id: toastId });
            } else {
                const newCouple = await createCouple(formData);
                setCouples([...couples, newCouple]);
                toast.success('Paar erfolgreich erstellt', { id: toastId });
            }
            handleCloseModal();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    const handleDelete = async (coupleId) => {
        if (window.confirm("Sind Sie sicher, dass Sie dieses Paar dauerhaft löschen möchten?")) {
            const toastId = toast.loading('Lösche Paar...');
            try {
                await deleteCouple(coupleId);
                setCouples(couples.filter(c => c.id !== coupleId));
                toast.success("Paar erfolgreich gelöscht", { id: toastId });
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Paare verwalten</h1>
                <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
                    <FaPlus className="mr-2" /> Paar anlegen
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                {/* Die Tabelle bleibt exakt gleich */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {/* ... (thead und tbody wie in Ihrer letzten Version) ... */}
                </table>
                 {couples.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">Keine Paare gefunden.</p>}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCouple ? "Paar bearbeiten" : "Neues Paar anlegen"}>
                {/* 2. DAS FORMULAR MIT DEN DROPDOWNS ERSETZEN */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="mr_first_name" value={formData.mr_first_name} onChange={handleChange} placeholder="Vorname Herr" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        <input name="mrs_first_name" value={formData.mrs_first_name} onChange={handleChange} placeholder="Vorname Dame" required className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="E-Mail" required className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Telefonnummer (optional)" className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <select name="start_group" value={formData.start_group} onChange={handleChange} required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600">
                            {START_GROUPS.map(group => <option key={group.value} value={group.value}>{group.label}</option>)}
                        </select>
                        <select name="start_class" value={formData.start_class} onChange={handleChange} required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600">
                            {START_CLASSES.map(cls => <option key={cls.value} value={cls.value}>{cls.label}</option>)}
                        </select>
                    </div>

                    <select name="dance_style" value={formData.dance_style} onChange={handleChange} required className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600">
                        {DANCE_STYLES.map(style => <option key={style.value} value={style.value}>{style.label}</option>)}
                    </select>
                    
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder={editingCouple ? "Neues Passwort (leer lassen)" : "Passwort"} required={!editingCouple} className="mt-4 p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleCloseModal} className="mr-4 px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Abbrechen</button>
                        <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Speichern</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default AdminCouplesManagementPage;