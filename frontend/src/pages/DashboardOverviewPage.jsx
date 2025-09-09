// /DaSpCoRate/frontend/src/pages/DashboardOverviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCouples, getSessions } from '../api/client';
import { toast } from 'react-hot-toast';

const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ coupleCount: 0, sessionCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Wir rufen die importierten Funktionen direkt auf
        const [couplesData, sessionsData] = await Promise.all([
          getCouples(),
          getSessions()
        ]);

        // Die Funktionen geben bereits die Daten zurück, nicht das ganze 'response'-Objekt
        setStats({
          coupleCount: couplesData.length,
          sessionCount: sessionsData.length,
        });

      } catch (error) {
        // Die Fehlerbehandlung aus client.js wird hier aufgefangen
        console.error("Fehler beim Laden der Dashboard-Daten:", error);
        toast.error("Übersichtsdaten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Lade Übersichtsdaten...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Willkommen zurück, {user ? user.first_name : 'Trainer'}!
      </h2>
      <p className="text-gray-600 mb-6">
        Hier ist eine Zusammenfassung deiner Aktivitäten in der DaSpCoRate-App.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-blue-800">{stats.coupleCount}</p>
          <p className="text-blue-600 font-semibold">Verwaltete Paare</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-green-800">{stats.sessionCount}</p>
          <p className="text-green-600 font-semibold">Durchgeführte Sessions</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;