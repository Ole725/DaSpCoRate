// /DaSpCoRate/frontend/src/components/RatingTable.jsx

import React from 'react';
import { ALL_CRITERIA } from '../lib/criteria';
import { useTheme } from '../context/ThemeContext';

// Prop 'isTransposedView' wird empfangen
function RatingTable({ enrolledCouples, existingRatings, onRate, onRemoveCouple, round = 1, isTransposedView, activeCriteria }) {

  // Die sortierte Liste der Paare wird an beiden Stellen gebraucht
  const sortedCouples = [...enrolledCouples].sort((a, b) => a.start_number - b.start_number);
  
  const criteriaToDisplay = ALL_CRITERIA.filter(c => activeCriteria.includes(c.key));
  
  // --- ANSICHT 2: Kompaktansicht (Paare in Reihen) ---
  if (isTransposedView) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-200 dark:bg-gray-800 border p-2 text-left z-10">Paar</th>
              {/* KORREKTUR: Iteriere über die gefilterte Liste */}
              {criteriaToDisplay.map(criterion => (
                <th key={criterion.key} className="border p-2 min-w-[120px]" title={criterion.label}>
                  {criterion.abbr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCouples.map(couple => (
              <tr key={couple.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="sticky left-0 bg-white dark:bg-gray-800 border p-2 font-semibold z-10 min-w-[150px] group relative">
                  <div className="text-2xl font-bold">{couple.start_number}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{couple.mr_first_name} & {couple.mrs_first_name}</div>
                  <button onClick={() => onRemoveCouple(couple.id)} className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Paar aus Session entfernen">&times;</button>
                </td>
                {/* KORREKTUR: Iteriere auch hier über die gefilterte Liste */}
                {criteriaToDisplay.map(criterion => {
                  const rating = existingRatings.find(r => r.couple_id === couple.id && r.category === criterion.key && r.round === round);
                  return (
                    <td key={criterion.key} className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3].map(points => {
                          const isSelected = rating && Number(rating.points) === points;
                          const buttonClasses = `w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`;
                          return <button key={points} onClick={() => onRate(couple.id, criterion.key, points)} className={buttonClasses}>{points}</button>;
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
  
  // --- ANSICHT 1: Standardansicht (Kriterien in Reihen) ---
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-gray-200 dark:bg-gray-800 border p-2 text-left z-10">Kriterium</th>
            {sortedCouples.map(couple => (
              <th key={couple.id} className="border p-2 min-w-[150px] relative group">
                <div className="text-2xl font-bold">{couple.start_number}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{couple.mr_first_name} & {couple.mrs_first_name}</div>
                <button onClick={() => onRemoveCouple(couple.id)} className="absolute top-1 right-1 bg-red-500 dark:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" title="Paar aus Session entfernen">&times;</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* KORREKTUR: Iteriere über die gefilterte Liste */}
          {criteriaToDisplay.map(criterion => (
            <tr key={criterion.key} className="hover:bg-gray-50">
              <td className={`sticky left-0 bg-white dark:bg-gray-800 border p-2 z-10 transition-all ${criterion.isMain ? 'font-bold' : 'pl-8'}`}>
                {criterion.label}
              </td>
              {sortedCouples.map(couple => {
                const rating = existingRatings.find(r => r.couple_id === couple.id && r.category === criterion.key && r.round === round);
                return (
                  <td key={couple.id} className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3].map(points => {
                        const isSelected = rating && Number(rating.points) === points;
                        const buttonClasses = `w-8 h-8 rounded-full font-bold flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`;
                        return <button key={points} onClick={() => onRate(couple.id, criterion.key, points)} className={buttonClasses}>{points}</button>;
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