// /DaSpCoRate/frontend/src/components/CoupleLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CoupleLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">
            Paar-Ansicht: {user ? `${user.mr_first_name} & ${user.mrs_first_name}` : '...'}
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      {/* --- NEUE STRUKTUR MIT SEITENLEISTE --- */}
      <div className="container mx-auto mt-4 p-4 flex">
        <aside className="w-1/4 pr-8">
          <nav className="bg-white p-4 rounded-lg shadow-lg">
            <ul>
              <li className="mb-2">
                <Link to="/couple-dashboard" className="text-green-600 hover:underline">Meine Bewertungen</Link>
              </li>
              <li className="mt-4 border-t pt-4">
                <Link to="/couple-dashboard/profile" className="text-green-600 hover:underline">Mein Profil</Link>
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