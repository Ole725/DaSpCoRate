// /DaSpCoRate/frontend/src/components/CoupleLayout.jsx

import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import Footer from '../components/Footer';

function CoupleLayout() {
  const { logout, user } = useAuth();
  const [nav, setNav] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNav = () => { setNav(!nav); };

  const handleLogout = () => {
    if (nav) { setNav(false); }
    logout();
    toast.success('Erfolgreich ausgeloggt.');
  };

  const navItems = [
    { id: 1, text: 'Übersicht', to: '/couple-dashboard' },
    { id: 2, text: 'Bewertungen', to: '/couple-dashboard/history' },
    { id: 3, text: 'Paar Profil', to: '/couple-dashboard/profile' }
  ];

  if (!user) { return <div>Lade Benutzerdaten...</div>; }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
            <Link to="/couple-dashboard">DaSpCoRate</Link>: {`${user.mrs_first_name} & ${user.mr_first_name}`}
          </h1>

          <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-4">
              {navItems.map(item => (
                <li key={item.id}>
                  <NavLink
                    to={item.to} end={item.to === '/couple-dashboard'}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-green-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`
                    }
                  >{item.text}</NavLink>
                </li>
              ))}
              {/* Theme-Switcher-Button */}
              <li>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">Logout</button>
              </li>
            </ul>
          </nav>
          
          <div className="block md:hidden">
             <button onClick={handleNav} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
             </button>
          </div>
        </div>
      </header>

      {/* --- MOBILES DROPDOWN-MENÜ --- */}
      <div
        className={`
          absolute top-16 right-4 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 
          rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
          transition ease-out duration-100 md:hidden z-50
          ${nav ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <div className="py-1">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-semibold text-green-600 dark:text-green-400">Menü</span>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
                {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>
          </div>
          <nav>
            {navItems.map(item => (
              <NavLink
                key={item.id} to={item.to} onClick={handleNav} end={item.to === '/couple-dashboard'}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm transition-colors ${
                    isActive ? 'bg-green-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >{item.text}</NavLink>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 mt-1">
              <button onClick={handleLogout} className="w-full text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">Logout</button>
            </div>
          </nav>
        </div>
      </div>

      <main className="container mx-auto p-4 flex-grow">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-4">
        <Footer />
      </footer>
    </div>
  );
}

export default CoupleLayout;