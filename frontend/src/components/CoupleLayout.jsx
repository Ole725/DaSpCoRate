// /DaSpCoRate/frontend/src/components/CoupleLayout.jsx (ABGESICHERTE VERSION)
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

function CoupleLayout() {
  const { logout, user } = useAuth(); // Holen Sie sich den Benutzer aus dem Context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Erfolgreich ausgeloggt.');
    // 'navigate' ist hier nicht mehr nötig, da der logout-Handler das schon macht.
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? 'font-bold text-green-800 underline'
      : 'text-green-600 hover:underline';
  };

  // --- HIER IST DIE ABSICHERUNG ---
  // Wenn der user-State noch nicht geladen ist, zeigen wir eine Lade-Meldung.
  // Das verhindert den Absturz und den WebSocket-Fehler.
  if (!user) {
    return <div>Lade Benutzerdaten...</div>;
  }
  // -------------------------------

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">
            <Link to="/couple-dashboard" className="hover:underline">Paar-Ansicht</Link>
            : {`${user.mrs_first_name} & ${user.mr_first_name}`}
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
        <aside className="w-1/4 pr-8">
          <nav className="bg-white p-4 rounded-lg shadow-lg">
            <ul>
              <li className="mb-2">
                <NavLink to="/couple-dashboard" end className={getNavLinkClass}>
                  Meine Bewertungen
                </NavLink>
              </li>
              <li className="mt-4 border-t pt-4">
                <NavLink to="/couple-dashboard/profile" className={getNavLinkClass}>
                  Mein Profil
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-3/4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CoupleLayout;