// /DaSpCoRate/frontend/src/components/RatingTable.jsx

// Die Kriterien, wie im PRD beschrieben
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

function RatingTable({ enrolledCouples, existingRatings, onRate, onRemoveCouple, round = 1 }) {
  
  console.log("RatingTable received new ratings:", existingRatings);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-gray-200 border p-2 text-left z-10">Kriterium</th>
            {/* ... */}
            {/* Header für jedes Paar mit Startnummer */}
            {enrolledCouples
            .sort((a, b) => a.start_number - b.start_number)
            .map(couple => (
              <th key={couple.id} className="border p-2 min-w-[150px] relative group">
                <div className="text-2xl font-bold">{couple.start_number}</div>
                <div className="text-xs text-gray-600">{couple.mr_first_name} & {couple.mrs_first_name}</div>
                {/* NEU: "Entfernen"-Button, der beim Hover erscheint */}
                <button
                  onClick={() => onRemoveCouple(couple.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Paar aus Session entfernen"
                >
                  &times;
                </button>
              </th>
          ))}
          </tr>
        </thead>
    <tbody>
      {criteria.map(criterion => (
        <tr key={criterion.key} className="hover:bg-gray-50">
          <td className="sticky left-0 bg-white border p-2 font-semibold z-10">{criterion.label}</td>
          {enrolledCouples.map(couple => {
            const rating = existingRatings.find(
              (r) => r.couple_id === couple.id && r.category === criterion.key && r.round === round
            );

            return (
              <td key={couple.id} className="border p-2 text-center">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3].map(points => {
                    const isSelected = rating && Number(rating.points) === points;

                    // Definiere die Klassen als vollständige Strings
                    const selectedClasses = 'bg-green-500 text-white';
                    const defaultClasses = 'bg-gray-200 hover:bg-gray-300';
                    const commonClasses = 'w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors';
                    
                    // Setze die Klassen basierend auf der Bedingung zusammen
                    const buttonClasses = `${commonClasses} ${isSelected ? selectedClasses : defaultClasses}`;

                    return (
                      <button
                        key={points}
                        onClick={() => onRate(couple.id, criterion.key, points)}
                        className={buttonClasses}
                      >
                        {points}
                      </button>
                    );
                  })}
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
      </table>
    </div>
  );
}

export default RatingTable;