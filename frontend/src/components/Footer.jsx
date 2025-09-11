// /DaSpCoRate/frontend/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto py-4 px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; {currentYear} DaSpCoRate. Alle Rechte vorbehalten.</p>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          
          <Link to="/contact" className="hover:text-blue-500 hover:underline">
            Kontakt & Feedback
          </Link>
          
          <span className="text-gray-400 dark:text-gray-600">|</span>
          
          <Link to="/impressum" className="hover:text-blue-500 hover:underline">
            Impressum
          </Link>
          
          <span className="text-gray-400 dark:text-gray-600">|</span>
          
          <Link to="/datenschutz" className="hover:text-blue-500 hover:underline">
            Datenschutz
          </Link>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;