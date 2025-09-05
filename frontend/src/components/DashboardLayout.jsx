// /DaSpCoRate/frontend/src/components/DashboardLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">
            <Link to="/dashboard">Tanzsport-App</Link>
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
                <Link to="/dashboard" className="text-blue-600 hover:underline">Übersicht</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard/couples" className="text-blue-600 hover:underline">Paar-Verwaltung</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard/sessions" className="text-blue-600 hover:underline">Session-Verwaltung</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-3/4">
          {/* Die Outlet-Komponente rendert die aktuell aktive "Kind"-Route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;