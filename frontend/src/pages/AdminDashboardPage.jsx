import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminStats } from '../api/client';
import { toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { FaUsers, FaChalkboardTeacher, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';

// Hilfskomponente für die Kacheln
const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center`}>
    <div className={`text-3xl mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

function AdminDashboardPage() {
  const { user } = useAuth();
  // Der State passt jetzt genau zu unserer API-Antwort
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        // Nur noch EIN super-schneller API-Aufruf
        const statsData = await getAdminStats();
        setStats(statsData);
      } catch (error) {
        console.error("Fehler beim Laden der Admin-Dashboard-Daten:", error);
        toast.error("Übersichtsdaten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color={"#4f46e5"} loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Willkommen, {user?.email || 'Admin'}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Dies ist die globale Übersicht aller Aktivitäten in der DaSpCoRate-App.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaUsers />} 
          title="Gesamtzahl Paare" 
          value={stats.couple_count}
          color="text-indigo-500"
        />
        <StatCard 
          icon={<FaChalkboardTeacher />} // <-- HIER IST DIE NEUE KACHEL
          title="Anzahl Trainer" 
          value={stats.trainer_count}
          color="text-emerald-500"
        />
        <StatCard 
          icon={<FaCalendarCheck />} 
          title="Anstehende Trainings" 
          value={stats.upcoming_session_count}
          color="text-amber-500"
        />
        <StatCard 
          icon={<FaCalendarTimes />} 
          title="Vergangene Trainings" 
          value={stats.past_session_count}
          color="text-rose-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;