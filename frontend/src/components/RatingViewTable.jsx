// /DaSpCoRate/frontend/src/components/RatingViewTable.jsx

const criteria = [
  { key: 'Technical Quality', label: 'Technical Quality' },
  { key: 'Movement to Music', label: 'Movement to Music' },
  { key: 'Partnering Skill', label: 'Partnering Skill' },
  { key: 'Choreography and Presentation', label: 'Choreography & Presentation' },
  { key: 'Posture & Balance', label: 'Posture & Balance' },
  { key: 'Start/Ending', label: 'Start/Ending' },
  { key: 'Floorcraft', label: 'Floorcraft' },
  { key: 'Stamina', label: 'Stamina' },
  { key: 'Appearance', label: 'Appearance' },
];

function RatingViewTable({ ratings, round }) {
  // Berechne die Gesamtpunktzahl für diese Runde
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
                <td className="sticky left-0 bg-white border p-2 font-semibold z-10">{criterion.label}</td>
                <td className="border p-2 text-center">
                  <div className="flex justify-center items-center gap-2">
                    {/* Zeige alle drei Zahlen an */}
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 1 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>1</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 2 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>2</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${rating?.points === 3 ? 'bg-blue-500 text-white font-bold' : 'bg-gray-200'}`}>3</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* NEU: Fußzeile mit Gesamtpunktzahl */}
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