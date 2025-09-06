// /DaSpCoRate/frontend/src/pages/CoupleDashboardPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { getMyRatings, getSessions } from '../api/client'; // getSessions importieren
import RatingViewTable from '../components/RatingViewTable';

function CoupleDashboardPage() {
  const [ratings, setRatings] = useState([]);
  const [sessions, setSessions] = useState([]); // State für Session-Infos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lade Bewertungen und alle Sessions parallel
        const [ratingsData, sessionsData] = await Promise.all([
          getMyRatings(),
          getSessions(),
        ]);
        setRatings(ratingsData);
        setSessions(sessionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Gruppiere die Bewertungen nach Session und Runde
  const groupedRatings = useMemo(() => {
    const groups = {};
    ratings.forEach(rating => {
      const key = `${rating.session_id}-${rating.round}`;
      if (!groups[key]) {
        groups[key] = {
          sessionId: rating.session_id,
          round: rating.round,
          ratings: []
        };
      }
      groups[key].ratings.push(rating);
    });
    return Object.values(groups).sort((a,b) => b.sessionId - a.sessionId || b.round - a.round);
  }, [ratings]);

  if (loading) return <p>Lade deine Bewertungen...</p>;
  if (error) return <p className="text-red-500">Fehler: {error}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Unsere Bewertungshistorie</h2>
      {groupedRatings.length > 0 ? (
        groupedRatings.map(group => {
          // Finde die passenden Session-Details
          const sessionInfo = sessions.find(s => s.id === group.sessionId);
          return (
            <div key={`${group.sessionId}-${group.round}`} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-1">
                {sessionInfo ? sessionInfo.title : `Session ID: ${group.sessionId}`}
              </h3>
              <p className="text-gray-600 mb-4">
                {sessionInfo ? `Datum: ${new Date(sessionInfo.session_date).toLocaleDateString('de-DE')}` : ''}
                <span className="font-bold ml-4">Runde {group.round}</span>
              </p>
              <RatingViewTable ratings={group.ratings} round={group.round} />
            </div>
          );
        })
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Du hast noch keine Bewertungen erhalten.</p>
        </div>
      )}
    </div>
  );
}
export default CoupleDashboardPage;