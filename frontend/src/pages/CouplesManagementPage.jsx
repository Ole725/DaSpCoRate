// /DaSpCoRate/frontend/src/pages/CoupleManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { getCouples, createCouple, updateCouple, deleteCouple } from '../api/client';
import toast from 'react-hot-toast';
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import Modal from '../components/Modal';
import ReusableTableRow from '../components/CoupleTableRow';

// --- KONSTANTEN ---

const START_GROUPS = [
  { value: 'Mas V', label: 'Masters V (Mas V)' }, { value: 'Mas IV', label: 'Masters IV (Mas IV)' },
  { value: 'Mas III', label: 'Masters III (Mas III)' }, { value: 'Mas II', label: 'Masters II (Mas II)' },
  { value: 'Hgr II', label: 'Hauptgruppe II (Hgr II)' }, { value: 'Hgr', label: 'Hauptgruppe (Hgr)' },
  { value: 'Jug', label: 'Jugend (Jug)' }, { value: 'Mas I', label: 'Masters I (Mas I)' },
  { value: 'Jun II', label: 'Junioren II (Jun II)' }, { value: 'Jun I', label: 'Junioren I (Jun I)' },
  { value: 'Kin II', label: 'Kinder II (Kin II)' }, { value: 'Kin I', label: 'Kinder I (Kin I)' },
];
const START_CLASSES = [
  { value: 'S', label: 'S' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
  { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'E', label: 'E' },
];
const DANCE_STYLES = [
  { value: 'Std', label: 'Standard (Std)' }, { value: 'Lat', label: 'Latein (Lat)' },
  { value: 'Std & Lat', label: 'Standard & Latein (Std & Lat)' },
];

const INITIAL_FORM_STATE = {
  mr_first_name: '', mrs_first_name: '', email: '', phone_number: '',
  start_group: 'Hgr', start_class: 'D', dance_style: 'Std', password: '',
};

// Finale Spalten-Konfiguration für die Tabelle
const tableHeaders = [
  { key: 'name', label: 'Name', render: (item) => `${item.mrs_first_name} ${item.mr_first_name}` },
  { key: 'phone', label: 'Telefon', render: (item) => item.phone_number, headerClassName: 'hidden sm:table-cell', className: 'hidden sm:table-cell text-gray-600 dark:text-gray-300' },
  { key: 'email', label: 'E-Mail', render: (item) => item.email, headerClassName: 'hidden md:table-cell', className: 'hidden md:table-cell text-gray-600 dark:text-gray-300' },
  { key: 'id', label: 'ID', render: (item) => item.id, className: 'font-medium text-gray-500 dark:text-gray-400' },
];


function CoupleManagementPage() {
    // --- STATE-MANAGEMENT ---
    const [couples, setCouples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCoupleData, setNewCoupleData] = useState(INITIAL_FORM_STATE);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCoupleData, setEditingCoupleData] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [coupleToDelete, setCoupleToDelete] = useState(null);
    const [isListVisible, setIsListVisible] = useState(true);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // --- DATENABRUF ---
    const fetchCouples = async () => {
        try {
            setLoading(true);
            const data = await getCouples();
            setCouples(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCouples();
    }, []);
    
    // --- HANDLER-FUNKTIONEN ---
    const handleToggleRow = (coupleId) => {
        setExpandedRowId(currentId => (currentId === coupleId ? null : coupleId));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupleData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingCoupleData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleAddCoupleSubmit = async (e) => {
        e.preventDefault();
        setIsActionLoading(true);
        try {
            await createCouple(newCoupleData);
            setIsModalOpen(false);
            toast.success('Paar erfolgreich hinzugefügt!');
            setNewCoupleData(INITIAL_FORM_STATE);
            await fetchCouples();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateCoupleSubmit = async (e) => {
        e.preventDefault();
        if (!editingCoupleData) return;
        setIsActionLoading(true);
        const { id, ...dataToUpdate } = editingCoupleData;
        try {
            await updateCouple(id, dataToUpdate);
            toast.success('Paardaten erfolgreich aktualisiert!');
            setIsEditModalOpen(false);
            setExpandedRowId(null);
            await fetchCouples();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!coupleToDelete) return;
        setIsActionLoading(true);
        try {
            await deleteCouple(coupleToDelete.id);
            toast.success('Paar wurde gelöscht.');
            setExpandedRowId(null);
            await fetchCouples();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsActionLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    // Modal-Öffnen/Schließen-Funktionen
    const openEditModal = (couple) => { setEditingCoupleData(couple); setIsEditModalOpen(true); };
    const closeEditModal = () => { setIsEditModalOpen(false); setEditingCoupleData(null); };
    const openDeleteModal = (couple) => { setCoupleToDelete(couple); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setIsDeleteModalOpen(false); setCoupleToDelete(null); };

    // --- RENDER-LOGIK ---
    if (loading) {
        return <div className="flex justify-center items-center h-64"><ClipLoader color="#3b82f6" size={50} /></div>;
    }
    if (error) {
        return <p className="text-red-500 dark:text-red-400 text-center">Fehler beim Laden der Paare: {error}</p>;
    }

    const commonInputClasses = "mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <>
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Paar-Verwaltung</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsListVisible(p => !p)}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            aria-label="Liste ein-/ausblenden"
                        >
                            {isListVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                        >
                            <FaPlus />
                            <span>Paar hinzufügen</span>
                        </button>
                    </div>
                </div>
                
                {isListVisible && (
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktion</th>
                                    {tableHeaders.map((header) => (
                                        <th key={header.key} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${header.headerClassName || ''}`}>
                                            {header.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {couples.map((couple) => (
                                    <ReusableTableRow
                                        key={couple.id}
                                        item={couple}
                                        headers={tableHeaders}
                                        isExpanded={expandedRowId === couple.id}
                                        onToggle={handleToggleRow}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                        isActionLoading={isActionLoading && expandedRowId === couple.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                        {couples.length === 0 && !loading && <p className="text-center py-8 text-gray-500 dark:text-gray-400">Keine Paare gefunden.</p>}
                    </div>
                )}
            </div>
            
            {/* --- MODALS --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neues Paar hinzufügen">
                <form onSubmit={handleAddCoupleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="mrs_first_name" placeholder="Vorname Dame" onChange={handleInputChange} value={newCoupleData.mrs_first_name} className={commonInputClasses} required />
                        <input type="text" name="mr_first_name" placeholder="Vorname Herr" onChange={handleInputChange} value={newCoupleData.mr_first_name} className={commonInputClasses} required />
                        <input type="email" name="email" placeholder="E-Mail" onChange={handleInputChange} value={newCoupleData.email} className={commonInputClasses} required />
                        <input type="tel" name="phone_number" placeholder="Telefonnummer" onChange={handleInputChange} value={newCoupleData.phone_number} className={commonInputClasses} />
                        
                        <select name="start_group" value={newCoupleData.start_group} onChange={handleInputChange} className={commonInputClasses}>
                            {START_GROUPS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        
                        <select name="start_class" value={newCoupleData.start_class} onChange={handleInputChange} className={commonInputClasses}>
                            {START_CLASSES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        
                        <select name="dance_style" value={newCoupleData.dance_style} onChange={handleInputChange} className={`${commonInputClasses} md:col-span-2`}>
                            {DANCE_STYLES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>

                        <input type="password" name="password" placeholder="Initiales Passwort" onChange={handleInputChange} value={newCoupleData.password} className={`${commonInputClasses} md:col-span-2`} required />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 mr-2">
                            Abbrechen
                        </button>
                        <button type="submit" disabled={isActionLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
                            {isActionLoading ? <ClipLoader size={20} color="#fff" /> : 'Hinzufügen'}
                        </button>
                    </div>
                </form>
            </Modal>

            {editingCoupleData && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Paardaten bearbeiten">
                    <form onSubmit={handleUpdateCoupleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="mrs_first_name" placeholder="Vorname Dame" onChange={handleEditInputChange} value={editingCoupleData.mrs_first_name} className={commonInputClasses} required />
                            <input type="text" name="mr_first_name" placeholder="Vorname Herr" onChange={handleEditInputChange} value={editingCoupleData.mr_first_name} className={commonInputClasses} required />
                            <input type="email" name="email" placeholder="E-Mail" onChange={handleEditInputChange} value={editingCoupleData.email} className={commonInputClasses} required />
                            <input type="tel" name="phone_number" placeholder="Telefonnummer" onChange={handleEditInputChange} value={editingCoupleData.phone_number} className={commonInputClasses} />

                            <select name="start_group" value={editingCoupleData.start_group} onChange={handleEditInputChange} className={commonInputClasses}>
                                {START_GROUPS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>

                            <select name="start_class" value={editingCoupleData.start_class} onChange={handleEditInputChange} className={commonInputClasses}>
                                {START_CLASSES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>

                            <select name="dance_style" value={editingCoupleData.dance_style} onChange={handleEditInputChange} className={`${commonInputClasses} md:col-span-2`}>
                                {DANCE_STYLES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>

                            {/* Optional: Passwortfeld zum Ändern hinzufügen */}
                            <input type="password" name="password" placeholder="Neues Passwort (optional)" onChange={handleEditInputChange} className={`${commonInputClasses} md:col-span-2`} />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 mr-2">
                                Abbrechen
                            </button>
                            <button type="submit" disabled={isActionLoading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center">
                                {isActionLoading ? <ClipLoader size={20} color="#fff" /> : 'Speichern'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Löschen bestätigen">
                <div>
                    <p>Möchtest du das Paar <span className="font-bold">{coupleToDelete?.mr_first_name} & {coupleToDelete?.mrs_first_name}</span> wirklich endgültig löschen?</p>
                    <div className="flex justify-end mt-6 space-x-4">
                        <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600">Abbrechen</button>
                        <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Löschen</button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default CoupleManagementPage;