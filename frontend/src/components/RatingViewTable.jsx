// /DaSpCoRate/frontend/src/components/RatingViewTable.jsx

const criteria = [
  { key: 'Technical Quality', label: 'Technical Quality' },
  // ... (kopieren Sie die komplette criteria-Liste aus RatingTable.jsx)
  { key: 'Appearance', label: 'Appearance' },
];

function RatingViewTable({ ratings, round }) {
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
                  <span 
                    className={`
                      w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto
                      ${rating ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}
                    `}
                  >
                    {rating ? rating.points : '-'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RatingViewTable;