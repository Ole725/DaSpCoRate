// /DaSpCoRate/frontend/src/pages/CouplesManagementPage.jsx
import { useState, useEffect } from 'react';
import { getCouples, createCouple } from '../api/client';
import Modal from '../components/Modal';

function CouplesManagementPage() {
  const [couples, setCouples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupleData, setNewCoupleData] = useState({
    mr_first_name: '',
    mrs_first_name: '',
    start_group: '',
    start_class: '',
    dance_style: '',
    email: '',
    password: '',
  });

  const fetchCouples = async () => {
    try {
      setError(null);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddCoupleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCouple(newCoupleData);
      setIsModalOpen(false);
      setNewCoupleData({ // Formular zurücksetzen
        mr_first_name: '',
        mrs_first_name: '',
        start_group: '',
        start_class: '',
        dance_style: '',
        email: '',
        password: '',
      });
      fetchCouples();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    // <> ist ein React Fragment, um mehrere Top-Level-Elemente zu ermöglichen
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Paar-Verwaltung</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Paar hinzufügen
          </button>
        </div>

        {/* --- HIER KOMMT DER TABELLEN-BLOCK HIN --- */}
        {loading && <p>Lade Paare...</p>}
        {error && <p className="text-red-500">Fehler: {error}</p>}
        {!loading && !error && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startgruppe/Klasse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-Mail</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Aktionen</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {couples.map((couple) => (
                <tr key={couple.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{couple.mr_first_name} & {couple.mrs_first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{couple.start_group} - {couple.start_class}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{couple.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">Bearbeiten</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* --- ENDE DES TABELLEN-BLOCKS --- */}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Neues Paar hinzufügen"
      >
        <form onSubmit={handleAddCoupleSubmit}>
          <input name="mr_first_name" value={newCoupleData.mr_first_name} onChange={handleInputChange} placeholder="Vorname Herr" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="mrs_first_name" value={newCoupleData.mrs_first_name} onChange={handleInputChange} placeholder="Vorname Dame" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="start_group" value={newCoupleData.start_group} onChange={handleInputChange} placeholder="Startgruppe" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="start_class" value={newCoupleData.start_class} onChange={handleInputChange} placeholder="Klasse" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="dance_style" value={newCoupleData.dance_style} onChange={handleInputChange} placeholder="Tanzstil (z.B. Std, Lat)" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="email" type="email" value={newCoupleData.email} onChange={handleInputChange} placeholder="E-Mail" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="password" type="password" value={newCoupleData.password} onChange={handleInputChange} placeholder="Passwort (min. 8 Zeichen)" required className="mb-2 shadow appearance-none border rounded w-full py-2 px-3" />
          
          <div className="flex justify-end mt-4">
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

export default CouplesManagementPage;