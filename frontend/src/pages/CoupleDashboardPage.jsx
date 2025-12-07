// /frontend/src/pages/CoupleDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyRatings } from '../api/client';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';
// Wir importieren ein paar Icons für die Anleitung
import { FaBars, FaLock, FaHistory, FaMoon, FaApple, FaAndroid, FaShareSquare, FaEllipsisV } from 'react-icons/fa';

const CoupleDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendedSessionsCount: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const ratingsData = await getMyRatings();
        
        // Berechne die Gesamtpunkte
        const totalPoints = ratingsData.reduce((sum, rating) => sum + rating.points, 0);

        // Berechne die Anzahl der einzigartigen Sessions
        const uniqueSessionIds = new Set(ratingsData.map(rating => rating.session_id));
        
        setStats({
          attendedSessionsCount: uniqueSessionIds.size,
          totalPoints: totalPoints,
        });

      } catch (error) {
        console.error("Fehler beim Laden der Dashboard-Daten:", error);
        toast.error("Übersichtsdaten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#3b82f6"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 1. SEKTION: STATISTIKEN (Wie bisher) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Willkommen, {user ? `${user.mrs_first_name} & ${user.mr_first_name}` : 'Paar'}!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hier ist eine Zusammenfassung eurer gemeinsamen Entwicklung.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg text-center border border-green-200 dark:border-green-800">
            <p className="text-4xl font-bold text-green-800 dark:text-green-400">{stats.attendedSessionsCount}</p>
            <p className="text-green-600 dark:text-green-300 font-semibold">Teilgenommene Trainings</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-4 rounded-lg text-center border border-indigo-200 dark:border-indigo-800">
            <p className="text-4xl font-bold text-indigo-800 dark:text-indigo-400">{stats.totalPoints}</p>
            <p className="text-indigo-600 dark:text-indigo-300 font-semibold">Gesammelte Punkte</p>
          </div>
        </div>
      </div>

      {/* 2. SEKTION: BEDIENUNGSANLEITUNG */}
      <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            ℹ️ Kurzanleitung zur Nutzung
        </h3>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
                <div className="mt-1 bg-white dark:bg-gray-600 p-2 rounded-full shadow-sm">
                    <FaBars className="text-blue-500" />
                </div>
                <div>
                    <span className="font-bold block">Profil & Passwort:</span>
                    Über das Menü oben rechts (Burger-Symbol) findet ihr unter <strong>"Paar Profil"</strong> eure Daten. Hier könnt ihr diese bearbeiten. 
                    <span className="block text-red-600 dark:text-red-400 font-bold mt-1 text-sm">
                        <FaLock className="inline mr-1" /> Wichtig: Bitte ändert beim ersten Login unbedingt euer Passwort!
                    </span>
                </div>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-1 bg-white dark:bg-gray-600 p-2 rounded-full shadow-sm">
                    <FaHistory className="text-purple-500" />
                </div>
                <div>
                    <span className="font-bold block">Ergebnisse einsehen:</span>
                    Unter <strong>"Bewertungen"</strong> seht ihr eure Historie. Ihr könnt dort zwischen drei Ansichten wählen: 
                    <em> Standard, Kompakt und Verlauf</em> – je nachdem, wie detailliert ihr die Punkte sehen möchtet.
                </div>
            </li>
            <li className="flex items-start gap-3">
                <div className="mt-1 bg-white dark:bg-gray-600 p-2 rounded-full shadow-sm">
                    <FaMoon className="text-yellow-500" />
                </div>
                <div>
                    <span className="font-bold block">Darstellung:</span>
                    Über das Mond-Symbol oben rechts könnt ihr jederzeit zwischen dem hellen Modus und dem dunklen Modus (angenehmer für die Augen am Abend) wechseln.
                </div>
            </li>
        </ul>
      </div>

      {/* 3. SEKTION: INSTALLATION (PWA) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            📲 Als App auf dem Handy installieren
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
            Damit ihr DaSpCoRate nicht immer im Browser suchen müsst, könnt ihr es direkt auf euren Startbildschirm legen. Das funktioniert wie eine normale App.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* APPLE iOS ANLEITUNG */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-white font-bold text-lg">
                    <FaApple className="text-2xl" /> iPhone / iPad (Safari)
                </div>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li>Öffnet diese Seite im <strong>Safari</strong> Browser.</li>
                    <li>Tippt unten in der Leiste auf das <strong>Teilen-Symbol</strong>:<br/>
                        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 border border-gray-300 dark:border-gray-600">
                             <FaShareSquare className="text-blue-500"/> (Viereck mit Pfeil)
                        </span>
                    </li>
                    <li>Scrollt etwas nach unten und wählt:<br/> <strong>"Zum Home-Bildschirm"</strong>.</li>
                    <li>Tippt oben rechts auf <strong>"Hinzufügen"</strong>.</li>
                </ol>
            </div>

            {/* ANDROID ANLEITUNG */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-white font-bold text-lg">
                    <FaAndroid className="text-2xl text-green-600" /> Android (Chrome)
                </div>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li>Öffnet diese Seite im <strong>Chrome</strong> Browser.</li>
                    <li>Tippt oben rechts auf die <strong>drei Punkte</strong>:<br/>
                        <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1 border border-gray-300 dark:border-gray-600">
                             <FaEllipsisV className="text-gray-600 dark:text-gray-300"/> (Menü)
                        </span>
                    </li>
                    <li>Wählt im Menü den Punkt:<br/> <strong>"App installieren"</strong> oder <strong>"Zum Startbildschirm zufügen"</strong>.</li>
                    <li>Bestätigt die Installation im folgenden Fenster.</li>
                </ol>
            </div>
        </div>
      </div>

    </div>
  );
};

export default CoupleDashboardPage;