// /DaSpCoRate/frontend/src/pages/CoupleDashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getMyRatings, getSessions } from '../api/client';
import RatingViewTable from '../components/RatingViewTable';

function CoupleDashboardPage() {
  const [ratings, setRatings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsData, sessionsData] = await Promise.all([
          getMyRatings(),
          getSessions(),
        ]);
        setRatings(ratingsData);
        setSessions(sessionsData);
      } catch (err) {
        toast.error(`Fehler beim Laden deiner Daten: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Gruppiere die Bewertungen jetzt primär nach Session
  const sessionsWithRatings = useMemo(() => {
    const sessionGroups = {};
    
    ratings.forEach(rating => {
      const sessionId = rating.session_id;
      if (!sessionGroups[sessionId]) {
        // Finde die Session-Infos
        const sessionInfo = sessions.find(s => s.id === sessionId);
        sessionGroups[sessionId] = {
          sessionInfo: sessionInfo || { title: `Session ID: ${sessionId}`, session_date: '' },
          totalScore: 0,
          rounds: {}
        };
      }
      
      const round = rating.round;
      if (!sessionGroups[sessionId].rounds[round]) {
        sessionGroups[sessionId].rounds[round] = {
          roundNumber: round,
          ratings: [],
          roundTotal: 0
        };
      }
      
      sessionGroups[sessionId].rounds[round].ratings.push(rating);
      sessionGroups[sessionId].rounds[round].roundTotal += rating.points;
      sessionGroups[sessionId].totalScore += rating.points;
    });
    
    return Object.values(sessionGroups)
                 .sort((a, b) => new Date(b.sessionInfo.session_date) - new Date(a.sessionInfo.session_date));

  }, [ratings, sessions]);

  if (loading) return <p>Lade deine Bewertungen...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Unsere Bewertungshistorie</h2>
      {sessionsWithRatings.length > 0 ? (
        sessionsWithRatings.map(sessionGroup => (
          <div key={sessionGroup.sessionInfo.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-md mb-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{sessionGroup.sessionInfo.title}</h3>
                <p className="text-sm">
                  Datum: {new Date(sessionGroup.sessionInfo.session_date).toLocaleDateString('de-DE')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{sessionGroup.totalScore}</p>
                <p className="text-sm">Gesamtpunkte</p>
              </div>
            </div>

            {/* Zeige die Detail-Tabellen für jede Runde in dieser Session */}
            <div className="space-y-6">
              {Object.values(sessionGroup.rounds)
                     .sort((a, b) => a.roundNumber - b.roundNumber)
                     .map(roundGroup => (
                <div key={roundGroup.roundNumber}>
                  <h4 className="text-lg font-semibold mb-2">Details für Runde {roundGroup.roundNumber}</h4>
                  <RatingViewTable ratings={roundGroup.ratings} round={roundGroup.roundNumber} />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Du hast noch keine Bewertungen erhalten.</p>
        </div>
      )}
    </div>
  );
}

export default CoupleDashboardPage;