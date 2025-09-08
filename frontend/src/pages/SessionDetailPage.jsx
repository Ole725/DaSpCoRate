// /DaSpCoRate/frontend/src/pages/SessionDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
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
import ResultsDisplay from '../components/ResultsDisplay';
import { unenrollCouple } from '../api/client';

function SessionDetailPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [allCouples, setAllCouples] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentRound, setCurrentRound] = useState(1); 
  const [isFinished, setIsFinished] = useState(false);

  const [isAddCoupleModalOpen, setIsAddCoupleModalOpen] = useState(false);
  const [startNumbers, setStartNumbers] = useState({});

  const [isRemoveConfirmModalOpen, setIsRemoveConfirmModalOpen] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState(null);

  // Lädt alle notwendigen Daten für die Seite
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
        toast.error(`Fehler beim Laden der Daten: ${err.message}`);
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
    
    const available = allCouples.filter(c => !enrollments.some(e => e.couple_id === c.id));
    
    available.forEach(couple => {
      initialStartNumbers[couple.id] = currentNumber;
      currentNumber++;
    });
    
    setStartNumbers(initialStartNumbers);
    setIsAddCoupleModalOpen(true);
  };

  const handleStartNumberChange = (coupleId, value) => {
    setStartNumbers(prev => ({ ...prev, [coupleId]: value }));
  };

  const handleAddCoupleToSession = async (coupleId) => {
    const startNumber = startNumbers[coupleId];
    if (!startNumber || isNaN(parseInt(startNumber))) {
      toast.error('Bitte geben Sie eine gültige Startnummer ein.');
      return;
    }
    try {
      await enrollCoupleByTrainer(parseInt(sessionId), coupleId, parseInt(startNumber));
      toast.success('Paar erfolgreich zur Session hinzugefügt!')
      const [enrollmentsData, allCouplesData] = await Promise.all([
        getEnrollmentsForSession(sessionId),
        getCouples()
      ]);
      setEnrollments(enrollmentsData);
      setAllCouples(allCouplesData);
    } catch (err) {
      toast.error(`Fehler beim Hinzufügen: ${err.message}`);
    }
  };

  // Handler für das Entfernen eines Paares
  const openRemoveConfirmModal = (coupleId) => {
    const enrollment = enrollments.find(e => e.couple_id === coupleId);
    if (enrollment) {
      const couple = allCouples.find(c => c.id === coupleId);
      setEnrollmentToRemove({ ...enrollment, coupleName: `${couple.mrs_first_name} & ${couple.mr_first_name}` });
      setIsRemoveConfirmModalOpen(true);
    }
  };

  const closeRemoveConfirmModal = () => {
    setIsRemoveConfirmModalOpen(false);
    setEnrollmentToRemove(null);
  };

  const handleRemoveConfirm = async () => {
    if (!enrollmentToRemove) return;
    try {
      await unenrollCouple(enrollmentToRemove.id);
      toast.success(`Paar wurde aus der Session entfernt.`);
      const enrollmentsData = await getEnrollmentsForSession(sessionId);
      setEnrollments(enrollmentsData);
    } catch (err) {
      toast.error(`Fehler beim Entfernen: ${err.message}`);
    } finally {
      closeRemoveConfirmModal();
    }
  };

  const handleRate = async (coupleId, category, points) => {
    const round = currentRound;
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
      toast.error(`Fehler beim Speichern: ${err.message}`);
      setRatings(originalRatings);
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prevRound => prevRound + 1);
  };

  const handleFinishTraining = () => {
    setIsFinished(true);
  };

  // Lade- und Fehlerzustände
  if (loading) return <div>Lade Session-Daten...</div>;
  if (!session) return null;

  // Berechnete Werte für die Anzeige (JETZT INNERHALB DER KOMPONENTE)
  const enrolledCouplesDetails = enrollments.map(enrollment => {
    const coupleDetails = allCouples.find(c => c.id === enrollment.couple_id);
    return coupleDetails ? { ...coupleDetails, start_number: enrollment.start_number } : null;
  }).filter(Boolean);

  const availableCouples = allCouples.filter(c => !enrollments.some(e => e.couple_id === c.id));
  
  const ratingsForCurrentRound = ratings.filter(r => r.round === currentRound);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1">{session.title}</h2>
            <p className="text-gray-600">Datum: {new Date(session.session_date).toLocaleDateString('de-DE')}</p>
          </div>
          {/* Zeige "Paar hinzufügen"-Button nur, wenn Training nicht beendet ist */}
          {!isFinished && (
            <button
              onClick={openAddCoupleModal}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              + Paar zur Session hinzufügen
            </button>
          )}
        </div>

        {/* --- KONDITIONALE ANZEIGE: TABELLE ODER ERGEBNISSE --- */}
        {!isFinished ? (
          <div>
            <h3 className="text-xl font-semibold my-4">Bewertungstabelle (Runde {currentRound})</h3>
            {enrolledCouplesDetails.length > 0 ? (
              <RatingTable 
                enrolledCouples={enrolledCouplesDetails}
                existingRatings={ratingsForCurrentRound}
                onRate={handleRate}
                onRemoveCouple={openRemoveConfirmModal}
                round={currentRound}
              />
            ) : (
              <p>Noch keine Paare für diese Session angemeldet.</p>
            )}
          </div>
        ) : (
          <ResultsDisplay 
            ratings={ratings}
            enrolledCouples={enrolledCouplesDetails}
            session={session}
          />
        )}
        
        {/* Steuerungs-Buttons, nur anzeigen wenn nicht beendet und Paare da sind */}
        {!isFinished && enrolledCouplesDetails.length > 0 && (
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleNextRound}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Nächste Runde
            </button>
            <button
              onClick={handleFinishTraining}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Training beenden
            </button>
          </div>
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
                  <span>{couple.mrs_first_name} & {couple.mr_first_name}</span>
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
      <Modal
        isOpen={isRemoveConfirmModalOpen}
        onClose={closeRemoveConfirmModal}
        title="Paar entfernen"
      >
        <div>
          <p>
            Möchtest du das Paar <span className="font-bold">{enrollmentToRemove?.coupleName}</span> wirklich aus der Session entfernen? Alle Bewertungen für dieses Paar in dieser Session werden ebenfalls gelöscht.
          </p>
         <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={closeRemoveConfirmModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Abbrechen
            </button>
            <button
              onClick={handleRemoveConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Entfernen
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SessionDetailPage;