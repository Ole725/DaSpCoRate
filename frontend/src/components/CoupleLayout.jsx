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
            <Link to="/couple-dashboard">Paar-Ansicht</Link>
            {user && <span className="text-sm font-normal text-gray-500 ml-2">{user.email}</span>}
          </h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-4 p-4">
        {/* Outlet für zukünftige Paar-Seiten wie "Mein Account" */}
        <Outlet />
      </main>
    </div>
  );
}

export default CoupleLayout;