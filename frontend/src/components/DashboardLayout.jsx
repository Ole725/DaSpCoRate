// /DaSpCoRate/frontend/src/components/DashboardLayout.jsx

import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const DashboardLayout = () => {
  const { logout, user } = useAuth();
  // 'navigate' wird hier nicht mehr benötigt, da logout() das bereits erledigt.

  const handleLogout = () => {
    logout();
    toast.success('Erfolgreich ausgeloggt.');
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'font-bold text-blue-800 underline'
      : 'text-blue-600 hover:underline';
  };

  // --- HIER IST DIE ABSICHERUNG (analog zum CoupleLayout) ---
  // Verhindert das kurze Aufblitzen von "..." und sorgt für eine saubere Ladeanzeige.
  if (!user) {
    return <div>Lade Trainer-Profil...</div>;
  }
  // -----------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            <Link to="/dashboard" className="hover:underline">DaSpCoRate Trainer</Link>
            {/* Der ternäre Operator ist jetzt nicht mehr nötig, da wir die Lade-Prüfung oben haben */}
            : {`${user.first_name} ${user.last_name}`}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="container mx-auto mt-4 p-4 flex">
        <aside className="w-1-4 pr-8">
          <nav className="bg-white p-4 rounded-lg shadow-lg">
            <ul>
              <li className="mb-2">
                <NavLink to="/dashboard" end className={getNavLinkClass}>
                  Übersicht
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/dashboard/couples" className={getNavLinkClass}>
                  Paar-Verwaltung
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/dashboard/sessions" className={getNavLinkClass}>
                  Session-Verwaltung
                </NavLink>
              </li>
              <li className="mt-4 border-t pt-4">
                <NavLink to="/dashboard/profile" className={getNavLinkClass}>
                  Mein Profil
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-3-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;