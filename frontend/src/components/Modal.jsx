// /DaSpCoRate/frontend/src/components/Modal.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null; // Wenn nicht offen, rendere nichts
  }

  return (
    // Overlay (dunkler Hintergrund)
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Modal-Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        {/* Modal-Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 text-2xl"
          >
            &times; {/* Schließen-Kreuz */}
          </button>
        </div>
        {/* Modal-Body (hier wird der Inhalt eingefügt) */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;