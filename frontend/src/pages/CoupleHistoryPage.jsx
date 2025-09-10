// /DaSpCoRate/frontend/src/pages/CoupleHistoryPage.jsx
import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getMyRatings, getSessions } from '../api/client';
import RatingViewTable from '../components/RatingViewTable';
import { ClipLoader } from 'react-spinners';
import { FaListUl, FaTable, FaChartLine } from 'react-icons/fa';
import PerformanceChart from '../components/PerformanceChart';
import { useTheme } from '../context/ThemeContext';

const criteria = [
  { key: 'Technical Quality', label: 'Technical Quality', isMain: true, abbr: 'TQ' },
  { key: 'Posture & Balance', label: 'Posture & Balance', isMain: false, abbr: 'P&B' },
  { key: 'Movement to Music', label: 'Movement to Music', isMain: true, abbr: 'M2M' },
  { key: 'Start/Ending', label: 'Start/Ending', isMain: false, abbr: 'S/E' },
  { key: 'Partnering Skill', label: 'Partnering Skill', isMain: true, abbr: 'PS' },
  { key: 'Floorcraft', label: 'Floorcraft', isMain: false, abbr: 'FC' },
  { key: 'Stamina', label: 'Stamina', isMain: false, abbr: 'ST' },
  { key: 'Choreography and Presentation', label: 'Choreography & Presentation', isMain: true, abbr: 'C&P' },
  { key: 'Appearance', label: 'Appearance', isMain: false, abbr: 'AP' },
];

function CoupleHistoryPage() {
  const [ratings, setRatings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('default');

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

  const { chartData, availableRounds } = useMemo(() => {
    let maxRound = 0;

    const data = sessionsWithRatings
      .slice()
      .sort((a, b) => new Date(a.sessionInfo.session_date) - new Date(b.sessionInfo.session_date))
      .map(sessionGroup => {
        const chartObject = {
          sessionDate: new Date(sessionGroup.sessionInfo.session_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
          totalScore: sessionGroup.totalScore,
        };

        Object.values(sessionGroup.rounds).forEach(round => {
          // Füge für jede Runde eine eigene Eigenschaft hinzu, z.B. round_1, round_2
          chartObject[`round_${round.roundNumber}`] = round.roundTotal;
          // Finde die höchste Rundennummer über alle Sessions hinweg
          if (round.roundNumber > maxRound) {
            maxRound = round.roundNumber;
          }
        });

        return chartObject;
      });
    
    // Erstelle ein Array von Rundennummern, z.B. [1, 2, 3], wenn 3 die höchste Runde war
    const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);

    return { chartData: data, availableRounds: rounds };
  }, [sessionsWithRatings]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Wertungen</h2>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button onClick={() => setViewMode('default')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${viewMode === 'default' ? 'bg-green-500 dark:text-green-900 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:border-gray-600'}`}>
              <FaListUl /> Standard
           </button>
            <button onClick={() => setViewMode('compact')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${viewMode === 'compact' ? 'bg-green-500 dark:text-green-900 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:border-gray-600'}`}>
              <FaTable /> Kompakt
            </button>
            <button onClick={() => setViewMode('graph')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-center gap-2 transition-colors ${viewMode === 'graph' ? 'bg-green-500 dark:text-green-900 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:border-gray-600'}`}>
              <FaChartLine /> Verlauf
           </button>
          </div>
      </div>
      
      {sessionsWithRatings.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <p>Du hast noch keine Bewertungen erhalten.</p>
        </div>
      )}

      {/* NEU: Bedingtes Rendern basierend auf viewMode */}
      {/* Ansicht 1: Standard (deine bisherige Ansicht) */}
      {viewMode === 'default' && sessionsWithRatings.length > 0 && sessionsWithRatings.map(sessionGroup => (
        <div key={sessionGroup.sessionInfo.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="bg-green-100 dark:bg-green-800 border-l-4 border-green-500 dark:border-green-400 text-green-800 dark:text-green-400 p-4 rounded-md mb-6 flex justify-between items-center">
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
      ))}
      {/* Ansicht 2: Kompakt-Tabelle */}
      {viewMode === 'compact' && sessionsWithRatings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="sticky left-0 bg-gray-100 dark:bg-gray-800 border p-2 text-left z-10">Training</th>
                {criteria.map(c => <th key={c.key} className="border p-2" title={c.label}>{c.abbr}</th>)}
                <th className="border p-2 font-bold">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {sessionsWithRatings.map(sessionGroup => (
                <tr key={sessionGroup.sessionInfo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="sticky left-0 bg-white dark:bg-gray-800 border p-2 font-semibold z-10">
                    <div>{sessionGroup.sessionInfo.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(sessionGroup.sessionInfo.session_date).toLocaleDateString('de-DE')}</div>
                  </td>
                  {criteria.map(criterion => {
                    const criterionTotal = Object.values(sessionGroup.rounds)
                                                 .flatMap(round => round.ratings)
                                                 .filter(rating => rating.category === criterion.key)
                                                 .reduce((sum, rating) => sum + rating.points, 0);
                    return <td key={criterion.key} className="border p-2 text-center">{criterionTotal > 0 ? criterionTotal : '-'}</td>;
                  })}
                  <td className="border p-2 text-center font-bold text-lg bg-gray-50 dark:bg-gray-700">{sessionGroup.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Ansicht 3: Platzhalter für den Graphen */}
      {viewMode === 'graph' && sessionsWithRatings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Leistungsverlauf</h3>
          <PerformanceChart data={chartData} rounds={availableRounds} />
        </div>
      )}

    </div>
  );
}

export default CoupleHistoryPage;