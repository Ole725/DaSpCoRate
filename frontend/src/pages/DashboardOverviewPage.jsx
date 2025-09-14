// /DaSpCoRate/frontend/src/pages/DashboardOverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCouples, getSessions } from '../api/client';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useTheme } from '../context/ThemeContext';

const DashboardOverviewPage = () => {
  const { user } = useAuth();
  // GEÄNDERT: State-Objekt für die neuen Zählungen anpassen
  const [stats, setStats] = useState({
    coupleCount: 0,
    upcomingSessionCount: 0,
    pastSessionCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [couplesData, sessionsData] = await Promise.all([
          getCouples(),
          getSessions()
        ]);

        // NEU: Logik zum Aufteilen der Sessions, genau wie auf der Management-Seite
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Zeit für sauberen Vergleich entfernen

        const upcomingSessions = sessionsData.filter(s => new Date(s.session_date) >= today);
        const pastSessions = sessionsData.filter(s => new Date(s.session_date) < today);

        // GEÄNDERT: Den State mit den neuen, detaillierten Werten befüllen
        setStats({
          coupleCount: couplesData.length,
          upcomingSessionCount: upcomingSessions.length,
          pastSessionCount: pastSessions.length,
        });

      } catch (error) {
        console.error("Fehler beim Laden der Dashboard-Daten:", error);
        toast.error("Übersichtsdaten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader
          color={"#3b82f6"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Willkommen zurück, {user ? user.first_name : 'Trainer'}!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Hier ist eine Zusammenfassung deiner Aktivitäten in der DanSCoR-App.
      </p>
      {/* GEÄNDERT: Grid-Layout für drei Spalten auf mittleren Bildschirmen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-blue-800 dark:text-blue-400">{stats.coupleCount}</p>
          <p className="text-blue-600 font-semibold">Verwaltete Paare</p>
        </div>
        
        {/* NEU: Eigene Karte für anstehende Sessions */}
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-yellow-800 dark:text-yellow-400">{stats.upcomingSessionCount}</p>
          <p className="text-yellow-600 font-semibold">Anstehende Sessions</p>
        </div>

        {/* GEÄNDERT: Karte für vergangene Sessions */}
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-green-800 dark:text-green-400">{stats.pastSessionCount}</p>
          <p className="text-green-600 dark:text-green-600 font-semibold">Vergangene Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;