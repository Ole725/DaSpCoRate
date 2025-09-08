// /DaSpCoRate/frontend/src/components/DashboardLayout.jsx
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// onLogout-Prop wird nicht mehr benötigt
function DashboardLayout() { 
  const { logout } = useAuth(); // Holen Sie sich die logout-Funktion aus dem Context

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            <Link to="/dashboard">DaSpCoRate-App</Link>
          </h1>
          <button
            onClick={logout} // Rufe direkt die logout-Funktion aus dem Context auf
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
                <Link to="/dashboard" className="text-blue-600 hover:underline">Übersicht</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard/couples" className="text-blue-600 hover:underline">Paar-Verwaltung</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard/sessions" className="text-blue-600 hover:underline">Session-Verwaltung</Link>
              </li>
              <li className="mt-4 border-t pt-4"> {/* Trennlinie */}
                <Link to="/dashboard/profile" className="text-blue-600 hover:underline">Mein Profil</Link>
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
export default DashboardLayout;