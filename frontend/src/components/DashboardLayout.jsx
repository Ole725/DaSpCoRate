// /DaSpCoRate/frontend/src/components/DashboardLayout.jsx

import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    if (nav) {
      setNav(false);
    }
    logout();
    toast.success('Erfolgreich ausgeloggt.');
  };

  // ===== KORRIGIERTE LINKS =====
  // Diese Links passen jetzt exakt zu deiner App.jsx
  const navItems = [
    { id: 1, text: 'Übersicht', to: '/dashboard' }, // Index-Route ist nur der Basis-Pfad
    { id: 2, text: 'Paare', to: '/dashboard/couples' },
    { id: 3, text: 'Sessions', to: '/dashboard/sessions' },
    { id: 4, text: 'Profil', to: '/dashboard/profile' }
  ];

  if (!user) {
    return <div>Lade Trainer-Profil...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            {/* KORRIGIERTER LINK zum Dashboard */}
            <Link to="/dashboard">DaSpCoRate</Link>: {`${user.first_name}`}
          </h1>

          <nav className="hidden md:flex items-center">
            <ul className="flex items-center space-x-4">
              {navItems.map(item => (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    // KORRIGIERT: 'end' Prop für die Haupt-Dashboard-Route
                    end={item.to === '/dashboard'}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
                      }`
                    }
                  >
                    {item.text}
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>

          <div onClick={handleNav} className="block md:hidden cursor-pointer">
            {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
          </div>
        </div>
      </header>

      <div
        className={
          nav
            ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-300 bg-white ease-in-out duration-300 z-40 md:hidden'
            : 'fixed left-[-100%] ease-in-out duration-300'
        }
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-600">Menü</h1>
        </div>
        <nav>
          <ul className="pt-2">
            {navItems.map(item => (
              <li key={item.id} className="border-b border-gray-200">
                <NavLink
                  to={item.to}
                  onClick={handleNav}
                  // KORRIGIERT: 'end' Prop hier ebenfalls anpassen
                  end={item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `block w-full text-left p-4 transition-colors ${
                      isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
                    }`
                  }
                >
                  {item.text}
                </NavLink>
              </li>
            ))}
            <li className="p-4 mt-4">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <main className="container mx-auto p-4 flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;