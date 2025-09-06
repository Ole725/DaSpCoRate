// /DaSpCoRate/frontend/src/components/ResultsDisplay.jsx
import { useMemo } from 'react';

function ResultsDisplay({ ratings, enrolledCouples, session }) {
  // ... (useMemo-Hook zum Berechnen der Ergebnisse bleibt gleich) ...
  const results = useMemo(() => {
    if (!enrolledCouples) return [];
    const coupleScores = {};

    enrolledCouples.forEach(couple => {
      coupleScores[couple.id] = {
        name: `${couple.mr_first_name} & ${couple.mrs_first_name}`,
        start_number: couple.start_number,
        total_score: 0,
        rounds: {},
      };
    });

    ratings.forEach(rating => {
      const coupleId = rating.couple_id;
      const round = rating.round;
      if (coupleScores[coupleId]) {
        coupleScores[coupleId].total_score += rating.points;
        if (!coupleScores[coupleId].rounds[round]) {
          coupleScores[coupleId].rounds[round] = 0;
        }
        coupleScores[coupleId].rounds[round] += rating.points;
      }
    });

    return Object.values(coupleScores).sort((a, b) => b.total_score - a.total_score);
  }, [ratings, enrolledCouples]);

  return (
    <div>
      {/* NEU: Grüner Ergebnis-Container */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md mb-6">
        <h3 className="font-bold text-lg">Training abgeschlossen</h3>
        <p>
          Session: <strong>{session?.title}</strong> am {session ? new Date(session.session_date).toLocaleDateString('de-DE') : ''}
        </p>
        {/* Hier könnte man eine Gesamtpunktzahl über alle Paare und Runden anzeigen, falls gewünscht */}
      </div>
      
      <h3 className="text-2xl font-bold mb-4">Gesamtergebnis</h3>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={result.start_number} className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <span className="text-xl font-bold text-blue-600 mr-4">Platz {index + 1}</span>
              <span className="font-semibold">(Startnummer {result.start_number}) {result.name}</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{result.total_score} Punkte</p>
              <p className="text-sm text-gray-500">
                {/* Zeige die Punkte pro Runde an */}
                {Object.entries(result.rounds).map(([round, score]) => `R${round}: ${score}`).join(' | ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ResultsDisplay;