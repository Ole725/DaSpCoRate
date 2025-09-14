// /frontend/src/components/CoupleTableRow.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaChartBar } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const CoupleTableRow = ({ item, headers, isExpanded, onToggle, onEdit, onDelete, isActionLoading }) => {
  return (
    <React.Fragment>
      <tr className={`${isExpanded ? 'bg-gray-100 dark:bg-gray-700' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
          <button
            onClick={() => onToggle(item.id)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Aktionen anzeigen"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </td>
        
        {headers.map((header) => (
          <td key={header.key} className={`px-6 py-4 whitespace-nowrap text-sm ${header.className || 'text-gray-700 dark:text-gray-300'}`}>
            {header.render(item)}
          </td>
        ))}
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50 dark:bg-gray-900">
          <td colSpan={headers.length + 1} className="px-6 py-4">
            <div className="flex justify-start items-center space-x-4 h-10">
              {isActionLoading ? (
                <ClipLoader color={"#4f46e5"} size={24} />
              ) : (
                <>
                  <Link
                    to={`../wertungen/${item.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FaChartBar size={16} />
                    <span>Wertungen</span>
                  </Link>

                  <button
                    onClick={() => onEdit(item)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FaEdit size={16} />
                    <span>Bearbeiten</span>
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <FaTrash size={16} />
                    <span>Löschen</span>
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default React.memo(CoupleTableRow);