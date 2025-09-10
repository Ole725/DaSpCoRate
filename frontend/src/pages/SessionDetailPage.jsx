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
  enrollCoupleByTrainer,
  unenrollCouple 
} from '../api/client';
import RatingTable from '../components/RatingTable';
import Modal from '../components/Modal';
import ResultsDisplay from '../components/ResultsDisplay';
import { ClipLoader } from 'react-spinners';
import { FaExchangeAlt } from 'react-icons/fa'; // Icon importieren

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
  const [isRemoveConfirmModalOpen, setIsRemoveConfirmModalOpen] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState(null);
  
  // HIER IST DIE KORREKTUR: Die fehlende State-Deklaration
  const [isTransposedView, setIsTransposedView] = useState(false);

  useEffect(() => {
    // ... fetchData bleibt unverändert
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

  // ... alle anderen Handler (openAddCoupleModal, handleAddCoupleToSession etc.) bleiben unverändert

  const openAddCoupleModal = () => setIsAddCoupleModalOpen(true);

  const handleAddCoupleToSession = async (coupleId) => {
    const maxStartNumber = enrollments.reduce((max, e) => Math.max(max, e.start_number), 0);
    const newStartNumber = maxStartNumber + 1;
    try {
      await enrollCoupleByTrainer(parseInt(sessionId), coupleId, newStartNumber);
      toast.success(`Paar mit Startnummer ${newStartNumber} hinzugefügt!`);
      const enrollmentsData = await getEnrollmentsForSession(sessionId);
      setEnrollments(enrollmentsData);
      setIsAddCoupleModalOpen(false);
    } catch (err) {
      toast.error(`Fehler beim Hinzufügen: ${err.message}`);
    }
  };
  
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

  const handleNextRound = () => setCurrentRound(prevRound => prevRound + 1);
  const handleFinishTraining = () => setIsFinished(true);

  if (loading) { return <div className="flex justify-center items-center h-64"><ClipLoader color={"#3b82f6"} loading={loading} size={50} /></div>; }
  if (!session) return null;

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
          {!isFinished && <button onClick={openAddCoupleModal} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">+ Paar zur Session hinzufügen</button>}
        </div>

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
                isTransposedView={isTransposedView}
              />
            ) : <p>Noch keine Paare für diese Session angemeldet.</p>}
          </div>
        ) : <ResultsDisplay ratings={ratings} enrolledCouples={enrolledCouplesDetails} session={session} />}
        
        {!isFinished && enrolledCouplesDetails.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setIsTransposedView(!isTransposedView)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded flex items-center gap-2"
              title="Ansicht wechseln"
            >
              <FaExchangeAlt />
              {isTransposedView ? 'Standardansicht' : 'Kompaktansicht'}
            </button>
            <div className="flex gap-4">
              <button onClick={handleNextRound} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Nächste Runde</button>
              <button onClick={handleFinishTraining} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Training beenden</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isAddCoupleModalOpen} onClose={() => setIsAddCoupleModalOpen(false)} title="Paar zur Session hinzufügen">
        <div>
          <h3 className="font-semibold mb-2">Verfügbare Paare</h3>
          {availableCouples.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {availableCouples.map(couple => (
                <li key={couple.id} className="border-b last:border-b-0">
                  <button onClick={() => handleAddCoupleToSession(couple.id)} className="w-full text-left p-3 hover:bg-blue-50 transition-colors duration-150">{couple.mrs_first_name} & {couple.mr_first_name}</button>
                </li>
              ))}
            </ul>
          ) : <p>Alle Paare sind bereits für diese Session angemeldet.</p>}
        </div>
      </Modal>

      <Modal isOpen={isRemoveConfirmModalOpen} onClose={closeRemoveConfirmModal} title="Paar entfernen">
        <div>
          <p>Möchtest du das Paar <span className="font-bold">{enrollmentToRemove?.coupleName}</span> wirklich aus der Session entfernen? Alle Bewertungen für dieses Paar in dieser Session werden ebenfalls gelöscht.</p>
         <div className="flex justify-end mt-6 space-x-4">
            <button onClick={closeRemoveConfirmModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Abbrechen</button>
            <button onClick={handleRemoveConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Entfernen</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default SessionDetailPage;