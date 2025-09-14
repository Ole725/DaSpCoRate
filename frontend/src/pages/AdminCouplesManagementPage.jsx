// /DaSpCoRate/frontend/src/pages/AdminCouplesManagementPage.jsx (VERSION MIT DROPDOWNS)

import React, { useState, useEffect } from 'react';
import { getCouples, createCouple, updateCouple, deleteCouple } from '../api/client';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { ClipLoader } from 'react-spinners';
import Modal from '../components/Modal';


// 1. DATEN-ARRAYS FÜR DIE DROPDOWNS HINZUFÜGEN
const START_GROUPS = [
  { value: 'Mas V', label: 'Masters V (Mas V)' },
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
    const [error, setError] = useState(null);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const initialCoupleData = {
        mr_first_name: '', mrs_first_name: '', start_group: '', start_class: '',
        dance_style: '',phone_number:'', email: '', password: '',
    };
    const [newCoupleData, setNewCoupleData] = useState(initialCoupleData);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCoupleData, setEditingCoupleData] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [coupleToDelete, setCoupleToDelete] = useState(null);
    const [isListVisible, setIsListVisible] = useState(false);

    const fetchCouples = async () => {
        try {
          setLoading(true);
          setError(null);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupleData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddCoupleSubmit = async (e) => {
    e.preventDefault();
    try {
        await createCouple(newCoupleData);
        setIsModalOpen(false);
        toast.success('Paar erfolgreich hinzugefügt!'); // ERFOLGSMELDUNG
        setNewCoupleData(initialCoupleData);
        fetchCouples();
    } catch (err) {
        toast.error(err.message); // ERSETZT alert()
    }
    };

    // Öffnet das Bearbeiten-Modal und füllt es mit den Daten des Paares
    const openEditModal = (couple) => {
        setEditingCoupleData(couple); // Speichere das ganze Paar-Objekt
        setIsEditModalOpen(true);
    };

    // Schließt das Bearbeiten-Modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingCoupleData(null);
    };

    // Aktualisiert den State, während der Trainer im Formular tippt
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingCoupleData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Sendet die aktualisierten Daten an die API
    const handleUpdateCoupleSubmit = async (e) => {
        e.preventDefault();
        if (!editingCoupleData) return;

    // Wir wollen nicht die ID oder das Passwort im Body mitsenden
    const { id, ...dataToUpdate } = editingCoupleData;

        try {
          await updateCouple(id, dataToUpdate);
          toast.success('Paardaten erfolgreich aktualisiert!');
          closeEditModal();
          fetchCouples(); // Daten neu laden, um die Änderungen anzuzeigen
        } catch (err) {
         toast.error(err.message);
        }
    };

    // Öffnet das Lösch-Modal und speichert das ausgewählte Paar
    const openDeleteModal = (couple) => {
        setCoupleToDelete(couple);
        setIsDeleteModalOpen(true);
    };

    // Schließt das Lösch-Modal und setzt die Auswahl zurück
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCoupleToDelete(null);
    };

    // Wird aufgerufen, wenn im Modal auf "Löschen" geklickt wird
    const handleDeleteConfirm = async () => {
        if (!coupleToDelete) return; // Sicherheitshalber

        try {
          await deleteCouple(coupleToDelete.id);
          toast.success(`Paar "${coupleToDelete.mr_first_name} & ${coupleToDelete.mrs_first_name}" wurde gelöscht.`);
          fetchCouples(); // Lade die Liste neu, um das gelöschte Paar zu entfernen
        } catch (err) {
          toast.error(err.message);
        } finally {
          closeDeleteModal(); // Modal auf jeden Fall schließen
        }
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <ClipLoader
            color={"#3b82f6"} // Eine passende blaue Farbe
            loading={loading}
            size={50} // Größe des Spinners
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500 dark:text-red-400 text-center">Fehler beim Laden der Paare: {error}</p>;
    }

    const commonInputClasses = "mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-400 leading-tight focus:outline-none focus:shadow-outline";

    const toggleListVisibility = () => {
    setIsListVisible(prevState => !prevState);
  };

    return (
      <>
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Paare verwalten</h1>
                <button
                    onClick={toggleListVisibility}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={isListVisible ? "Paarliste ausblenden" : "Paarliste einblenden"}
                >
                {isListVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  + Paar hinzufügen
                </button>
            </div>
            
            {isListVisible && (
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                   <thead className="bg-gray-50 dark:bg-gray-700">
                       <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefon</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">E-Mail</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aktionen</th>
                            </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {couples.map((couple) => (
                            <tr key={couple.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{couple.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{couple.mrs_first_name} {couple.mr_first_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{couple.phone_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{couple.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(couple)} className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 mr-4 transition-colors"><FaEdit size={18} /></button>
                                    <button onClick={() => openDeleteModal(couple)} className="text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"><FaTrash size={18} /></button>
                               </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            {couples.length === 0 && <p className="text-center py-8 text-gray-500 dark:text-gray-400">Keine Paare gefunden.</p>}
        </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Neues Paar hinzufügen">
            <form onSubmit={handleAddCoupleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="mrs_first_name" value={newCoupleData.mrs_first_name} onChange={handleInputChange} placeholder="Vorname Dame" required className={commonInputClasses} />
                    <input name="mr_first_name" value={newCoupleData.mr_first_name} onChange={handleInputChange} placeholder="Vorname Herr" required className={commonInputClasses} />
                </div>

                <div className="gap-4">
                    <select name="start_group" value={newCoupleData.start_group} onChange={handleInputChange} required className={commonInputClasses}>
                        <option value="" disabled>Startgruppe auswählen...</option>
                        {START_GROUPS.map(group => <option key={group.value} value={group.value}>{group.label}</option>)}
                    </select>
                    <select name="start_class" value={newCoupleData.start_class} onChange={handleInputChange} required className={commonInputClasses}>
                        <option value="" disabled>Klasse auswählen...</option>
                        {START_CLASSES.map(cls => <option key={cls.value} value={cls.value}>{cls.label}</option>)}
                    </select>
                    <select name="dance_style" value={newCoupleData.dance_style} onChange={handleInputChange} required className={commonInputClasses}>
                        <option value="" disabled>Tanzstil auswählen...</option>
                        {DANCE_STYLES.map(style => <option key={style.value} value={style.value}>{style.label}</option>)}
                    </select>
                </div>

                <input name="phone_number" type="tel" value={newCoupleData.phone_number} onChange={handleInputChange} placeholder="Mobil (Optional)" optional className={commonInputClasses} />
                <input name="email" type="email" value={newCoupleData.email} onChange={handleInputChange} placeholder="E-Mail" required className={commonInputClasses} />
                <input name="password" type="password" value={newCoupleData.password} onChange={handleInputChange} placeholder="Passwort (min. 8 Zeichen)" required className={commonInputClasses} />
          
                <div className="flex justify-end mt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2">Abbrechen</button>
                    <button type="submit" className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Speichern</button>
                </div>
            </form>
        </Modal>

      {/* Modal zum Bearbeiten eines Paares */}
      {editingCoupleData && (
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title="Paardaten bearbeiten">
        <form onSubmit={handleUpdateCoupleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="mrs_first_name" value={editingCoupleData.mrs_first_name} onChange={handleEditInputChange} placeholder="Vorname Dame" required className={commonInputClasses} />
            <input name="mr_first_name" value={editingCoupleData.mr_first_name} onChange={handleEditInputChange} placeholder="Vorname Herr" required className={commonInputClasses} />
          </div>

          <div className="gap-4">
            <select name="start_group" value={editingCoupleData.start_group} onChange={handleEditInputChange} required className={commonInputClasses}>
                <option value="" disabled>Startgruppe auswählen...</option>
                {START_GROUPS.map(group => <option key={group.value} value={group.value}>{group.label}</option>)}
            </select>
            <select name="start_class" value={editingCoupleData.start_class} onChange={handleEditInputChange} required className={commonInputClasses}>
                <option value="" disabled>Klasse auswählen...</option>
                {START_CLASSES.map(cls => <option key={cls.value} value={cls.value}>{cls.label}</option>)}
            </select>
            <select name="dance_style" value={editingCoupleData.dance_style} onChange={handleEditInputChange} required className={commonInputClasses}>
                <option value="" disabled>Tanzstil auswählen...</option>
                {DANCE_STYLES.map(style => <option key={style.value} value={style.value}>{style.label}</option>)}
            </select>
          </div>

          <input name="phone_number" type="tel" value={editingCoupleData.phone_number} onChange={handleEditInputChange} placeholder="Mobil (Optional)" optional className={commonInputClasses} />
            
          <div className="flex justify-end mt-4">
            <button type="button" onClick={closeEditModal} className="bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded mr-2">Abbrechen</button>
            <button type="submit" className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Änderungen speichern</button>
          </div>
        </form>
      </Modal>
      )}
      {/* Modal zum Bestätigen des Löschens */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Löschen bestätigen"
      >
        <div>
          <p>
            Möchtest du das Paar <span className="font-bold">{coupleToDelete?.mr_first_name} & {coupleToDelete?.mrs_first_name}</span> wirklich endgültig löschen?
          </p>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Abbrechen
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded hover:bg-red-700 dark:hover:bg-red-600"
            >
              Löschen
            </button>
          </div>
        </div>
      </Modal>
     </div>
     </>
    );
}

export default AdminCouplesManagementPage;