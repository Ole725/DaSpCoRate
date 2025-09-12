// /DaSpCoRate/frontend/src/components/AdminLayout.jsx (FINALE VERSION)

import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaTachometerAlt, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import Footer from './Footer';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const [nav, setNav] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNav = () => setNav(!nav);

  const handleLogout = () => {
    if (nav) setNav(false);
    logout();
    toast.success('Erfolgreich ausgeloggt.');
  };

  // VERBESSERT: Navigations-Links mit Text, Pfad UND Icon
  const navItems = [
    { id: 1, text: 'Admin Übersicht', to: '/admin', icon: <FaTachometerAlt /> },
    { id: 2, text: 'Trainer verwalten', to: '/admin/trainers', icon: <FaChalkboardTeacher /> },
    { id: 3, text: 'Paare verwalten', to: '/admin/couples', icon: <FaUsers /> },
  ];

  if (!user) {
    return <div>Lade Admin-Profil...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <Link to="/admin">DaSpCoRate Admin</Link>: {user.email}
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-4">
              {navItems.map(item => (
                <li key={item.id}>
                  <NavLink
                    to={item.to} end={item.to === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    {/* HINZUGEFÜGT: Icon wird hier angezeigt */}
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                  </NavLink>
                </li>
              ))}
              <li>
                <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
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
      
      {/* Mobile Navigation (Dropdown) */}
      <div
        className={`
          absolute top-16 right-4 w-56 mt-2 origin-top-right bg-white dark:bg-gray-800 
          rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50
          transition ease-out duration-100 md:hidden
          ${nav ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'}
        `}
      >
        {/* Der innere Teil bleibt gleich */}
        <div className="py-1">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Admin Menü</span>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle dark mode">
                {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>
          </div>
          <nav>
            {navItems.map(item => (
              <NavLink
                key={item.id} to={item.to} onClick={handleNav} end={item.to === '/admin'}
                className={({ isActive }) => `flex items-center px-4 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.text}
              </NavLink>
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

      <Footer />
    </div>
  );
};

export default AdminLayout;