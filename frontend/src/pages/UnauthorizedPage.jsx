// /DaSpCoRate/frontend/src/pages/UnauthorizedPage.jsx
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Zugriff verweigert</h1>
      <p className="text-lg text-gray-700 mb-6">Sie haben keine Berechtigung, auf diese Seite zuzugreifen.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Zurück zur Startseite
      </Link>
    </div>
  );
}
export default UnauthorizedPage;