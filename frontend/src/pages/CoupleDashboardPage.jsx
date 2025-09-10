// /frontend/src/pages/CoupleDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { getMyRatings } from '../api/client';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../context/AuthContext';

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
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Willkommen, {user ? `${user.mrs_first_name} & ${user.mr_first_name}` : 'Paar'}!
      </h2>
      <p className="text-gray-600 mb-6">
        Hier ist eine Zusammenfassung eurer gemeinsamen Entwicklung.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-green-800">{stats.attendedSessionsCount}</p>
          <p className="text-green-600 font-semibold">Teilgenommene Trainings</p>
        </div>
        <div className="bg-indigo-100 p-4 rounded-lg text-center">
          <p className="text-4xl font-bold text-indigo-800">{stats.totalPoints}</p>
          <p className="text-indigo-600 font-semibold">Gesammelte Punkte</p>
        </div>
      </div>
    </div>
  );
};

export default CoupleDashboardPage;