// /DaSpCoRate/frontend/src/pages/LoginPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdMan, MdWoman } from 'react-icons/md';
import Footer from '../components/Footer';

function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError('E-Mail oder Passwort ist ungültig. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
       <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto p-4 flex justify-center items-center">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DanSCoR</h1>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 bg-blue-600 dark:bg-blue-700 text-white p-12 flex flex-col justify-center items-center text-center">
            <div className="flex items-center justify-center text-6xl mb-4 text-blue-200 gap-1"><MdMan /><MdWoman /></div>
            <h1 className="text-3xl font-bold mb-2">Willkommen bei DanSCoR</h1>
            <p className="text-blue-100 mb-6">Eure Web-App für Trainings-Bewertungen.</p>
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">Anmelden</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">E-Mail</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">Passwort</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white bg-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" disabled={loading} className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 w-full transition-colors">
                  {loading ? 'Anmelden...' : 'Anmelden'}
                </button>
              </div>
              {error && <p className="mt-4 text-center text-red-500 dark:text-red-400 text-sm">{error}</p>}
            </form>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;