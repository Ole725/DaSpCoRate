// /DaSpCoRate/frontend/src/components/RatingViewTable.jsx

import React from 'react'; // React importieren

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

function RatingViewTable({ ratings, round }) {
  const roundTotal = ratings.reduce((total, rating) => total + rating.points, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky left-0 bg-gray-100 border p-2 text-left z-10">Kriterium</th>
            <th className="border p-2">Bewertung</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map(criterion => {
            const rating = ratings.find(
              (r) => r.category === criterion.key && r.round === round
            );
            return (
              <tr key={criterion.key} className="hover:bg-gray-50">
                {/* HIER: Die gleiche bedingte Klassenanwendung */}
                <td className={`sticky left-0 bg-white border p-2 z-10 transition-all ${
                  criterion.isMain ? 'font-bold' : 'pl-8' // Hauptkriterien fett, Unterkriterien eingerückt
                }`}>
                  {criterion.label}
                </td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 1 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>1</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 2 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>2</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 3 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>3</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold">
            <td className="sticky left-0 bg-gray-100 border p-2 text-right z-10">Gesamtpunktzahl Runde {round}:</td>
            <td className="border p-2 text-center text-lg">{roundTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default RatingViewTable;