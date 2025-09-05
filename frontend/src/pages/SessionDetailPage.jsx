// /DaSpCoRate/frontend/src/pages/SessionDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getSessionDetails, 
  getEnrollmentsForSession, 
  getRatingsForSession, 
  createRating, 
  getCouples,
  updateRating,
  enrollCoupleByTrainer 
} from '../api/client';
import RatingTable from '../components/RatingTable';
import Modal from '../components/Modal';

function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [allCouples, setAllCouples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States für das "Paar hinzufügen"-Modal
  const [isAddCoupleModalOpen, setIsAddCoupleModalOpen] = useState(false);
  const [startNumbers, setStartNumbers] = useState({}); // Speichert die Startnummern für die Paare im Modal

  // Lädt alle notwendigen Daten für die Seite
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [sessionData, enrollmentsData, ratingsData, allCouplesData] = await Promise.all([
          getSessionDetails(sessionId),
          getEnrollmentsForSession(sessionId),
          getRatingsForSession(sessionId),
          getCouples(),
        ]);
        setSession(sessionData);
        setEnrollments(enrollmentsData);
        setRatings(ratingsData);
        setAllCouples(allCouplesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sessionId]);

  // Handler zum Öffnen des "Paar hinzufügen"-Modals
  const openAddCoupleModal = () => {
    const maxNumber = enrollments.reduce((max, e) => Math.max(max, e.start_number), 0);
    const initialStartNumbers = {};
    let currentNumber = maxNumber + 1;
    
    // Filtere verfügbare Paare direkt hier
    const available = allCouples.filter(c => !enrollments.some(e => e.couple_id === c.id));
    
    available.forEach(couple => {
      initialStartNumbers[couple.id] = currentNumber;
      currentNumber++;
    });
    
    setStartNumbers(initialStartNumbers);
    setIsAddCoupleModalOpen(true);
  };

  // Handler zum Ändern einer Startnummer im Modal
  const handleStartNumberChange = (coupleId, value) => {
    setStartNumbers(prev => ({ ...prev, [coupleId]: value }));
  };

  // Handler, wenn der "Hinzufügen"-Button für ein spezifisches Paar geklickt wird
  const handleAddCoupleToSession = async (coupleId) => {
    const startNumber = startNumbers[coupleId];
    if (!startNumber || isNaN(parseInt(startNumber))) {
      alert('Bitte geben Sie eine gültige Startnummer ein.');
      return;
    }

    try {
      await enrollCoupleByTrainer(parseInt(sessionId), coupleId, parseInt(startNumber));
      
      // Lade die Anmeldungen und Paare neu, um die UI zu aktualisieren.
      // Das Modal bleibt offen für weitere Ergänzungen.
      const [enrollmentsData, allCouplesData] = await Promise.all([
        getEnrollmentsForSession(sessionId),
        getCouples()
      ]);
      setEnrollments(enrollmentsData);
      setAllCouples(allCouplesData);

    } catch (err) {
      alert(`Fehler beim Hinzufügen des Paares: ${err.message}`);
    }
  };

  // Handler für die Bewertung (bleibt unverändert)
  const handleRate = async (coupleId, category, points) => {
    const round = 1;
    const originalRatings = [...ratings];
    const existingRating = ratings.find(r => r.couple_id === coupleId && r.category === category && r.round === round);
    let optimisticRatings;
    if (existingRating) {
      optimisticRatings = ratings.map(r => r.id === existingRating.id ? { ...r, points } : r);
    } else {
      const tempRating = { id: Date.now() * -1, session_id: parseInt(sessionId), couple_id: coupleId, round, category, points, created_at: new Date().toISOString() };
      optimisticRatings = [...ratings, tempRating];
    }
    setRatings(optimisticRatings);
    try {
      if (existingRating) {
        await updateRating(existingRating.id, points);
      } else {
        await createRating({ session_id: parseInt(sessionId), couple_id: coupleId, round, category, points });
      }
      const finalRatingsData = await getRatingsForSession(sessionId);
      setRatings(finalRatingsData);
    } catch (err) {
      alert(`Fehler beim Speichern der Bewertung: ${err.message}`);
      setRatings(originalRatings);
    }
  };

  // Lade- und Fehlerzustände
  if (loading) return <div>Lade Session-Daten...</div>;
  if (error) return <div className="text-red-500">Fehler: {error}</div>;
  if (!session) return null;

  // Berechnete Werte für die Anzeige
  const enrolledCouplesDetails = enrollments.map(enrollment => {
    const coupleDetails = allCouples.find(c => c.id === enrollment.couple_id);
    return coupleDetails ? { ...coupleDetails, start_number: enrollment.start_number } : null;
  }).filter(Boolean);

  const availableCouples = allCouples.filter(c => !enrollments.some(e => e.couple_id === c.id));

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{session.title}</h2>
            <p className="text-gray-600">Datum: {new Date(session.session_date).toLocaleDateString('de-DE')}</p>
          </div>
          <button
            onClick={openAddCoupleModal}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            + Paar zur Session hinzufügen
          </button>
        </div>
        
        <h3 className="text-xl font-semibold my-4">Bewertungstabelle (Runde 1)</h3>
        {enrolledCouplesDetails.length > 0 ? (
          <RatingTable 
            enrolledCouples={enrolledCouplesDetails}
            existingRatings={ratings}
            onRate={handleRate}
            round={1}
          />
        ) : (
          <p>Noch keine Paare für diese Session angemeldet.</p>
        )}
      </div>

      <Modal
        isOpen={isAddCoupleModalOpen}
        onClose={() => setIsAddCoupleModalOpen(false)}
        title="Paar zur Session hinzufügen"
      >
        <div>
          <h3 className="font-semibold mb-2">Verfügbare Paare</h3>
          {availableCouples.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {availableCouples.map(couple => (
                <li key={couple.id} className="flex justify-between items-center p-2 border-b gap-4">
                  <span>{couple.mr_first_name} & {couple.mrs_first_name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={startNumbers[couple.id] || ''}
                      onChange={(e) => handleStartNumberChange(couple.id, e.target.value)}
                      className="w-20 text-center border rounded-md"
                      placeholder="Nr."
                    />
                    <button
                      onClick={() => handleAddCoupleToSession(couple.id)}
                      className="bg-blue-500 text-white text-xs py-1 px-2 rounded"
                    >
                      Hinzufügen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Alle Paare sind bereits für diese Session angemeldet.</p>
          )}
        </div>
      </Modal>
    </>
  );
}

export default SessionDetailPage;