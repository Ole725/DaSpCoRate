// /DaSpCoRate/frontend/src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { getMe, updateMyCoupleProfile, changeMyPassword } from '../api/client';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States für die Formulare
  const [profileData, setProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        // Unterscheide, ob es ein Paar oder Trainer ist, um das Formular vorzubereiten
        if (userData.start_class) { // Ein einfaches Merkmal, um ein Paar zu erkennen
          setProfileData({
            mr_first_name: userData.mr_first_name,
            mrs_first_name: userData.mrs_first_name,
            start_group: userData.start_group,
            start_class: userData.start_class,
          });
        } else {
          // Logik für Trainerprofil (können wir später hinzufügen)
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError(null);
    try {
      // Momentan unterstützen wir nur die Profiländerung für Paare
      if (user.start_class) {
        await updateMyCoupleProfile(profileData);
        setSuccessMessage('Profil erfolgreich aktualisiert!');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError(null);
    try {
      await changeMyPassword(passwordData);
      setSuccessMessage('Passwort erfolgreich geändert!');
      // Formular zurücksetzen
      setPasswordData({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Lade Profil...</div>;

  return (
    <div className="space-y-8">
      {/* Erfolgs- und Fehlermeldungen */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{successMessage}</div>}

      {/* Profil bearbeiten Formular (nur für Paare im Moment) */}
      {user && user.start_class && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Profil bearbeiten</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <input name="mr_first_name" value={profileData.mr_first_name} onChange={handleProfileChange} placeholder="Vorname Herr" className="shadow appearance-none border rounded w-full py-2 px-3" />
            <input name="mrs_first_name" value={profileData.mrs_first_name} onChange={handleProfileChange} placeholder="Vorname Dame" className="shadow appearance-none border rounded w-full py-2 px-3" />
            <input name="start_group" value={profileData.start_group} onChange={handleProfileChange} placeholder="Startgruppe" className="shadow appearance-none border rounded w-full py-2 px-3" />
            <input name="start_class" value={profileData.start_class} onChange={handleProfileChange} placeholder="Klasse" className="shadow appearance-none border rounded w-full py-2 px-3" />
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded">Profil speichern</button>
          </form>
        </div>
      )}

      {/* Passwort ändern Formular */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Passwort ändern</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input name="current_password" type="password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Aktuelles Passwort" required className="shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="new_password" type="password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="Neues Passwort" required className="shadow appearance-none border rounded w-full py-2 px-3" />
          <input name="confirm_new_password" type="password" value={passwordData.confirm_new_password} onChange={handlePasswordChange} placeholder="Neues Passwort bestätigen" required className="shadow appearance-none border rounded w-full py-2 px-3" />
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded">Passwort ändern</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;