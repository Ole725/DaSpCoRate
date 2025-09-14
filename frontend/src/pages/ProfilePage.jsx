// /DaSpCoRate/frontend/src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMe, updateMyCoupleProfile, changeMyPassword } from '../api/client';
import { ClipLoader } from 'react-spinners';
import { useTheme } from '../context/ThemeContext';

const START_GROUPS = [
  { value: 'Mas V', label: 'Masters V (Mas V)' },
  { value: 'Mas IV', label: 'Masters IV (Mas IV)' },
  { value: 'Mas III', label: 'Masters III (Mas III)' },
  { value: 'Mas II', label: 'Masters II (Mas II)' },
  { value: 'Hgr II', label: 'Hauptgruppe II (Hgr II)' },
  { value: 'Hgr', label: 'Hauptgruppe (Hgr)' },
  { value: 'Jug', label: 'Jugend (Jug)' },
  { value: 'Mas I', label: 'Masters I (Mas I)' },
  { value: 'Jun II', label: 'Junioren II (Jun II)' },
  { value: 'Jun I', label: 'Junioren I (Jun I)' },
  { value: 'Kin II', label: 'Kinder II (Kin II)' },
  { value: 'Kin I', label: 'Kinder I (Kin I)' },
];

const START_CLASSES = [
  { value: 'S', label: 'S' }, { value: 'A', label: 'A' }, { value: 'B', label: 'B' },
  { value: 'C', label: 'C' }, { value: 'D', label: 'D' }, { value: 'E', label: 'E' },
];

const DANCE_STYLES = [
  { value: 'Std', label: 'Standard (Std)' },
  { value: 'Lat', label: 'Latein (Lat)' },
  { value: 'Std & Lat', label: 'Standard & Latein (Std & Lat)' },
];

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // States für die Formulare
  const [profileData, setProfileData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

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
            dance_style: userData.dance_style,
            phone_number: userData.phone_number || '',
            email: userData.email,
          });
        } else {
          // Logik für Trainerprofil (können wir später hinzufügen)
        }
      } catch (err) {
        toast.error(err.message);
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

    try {
      // Momentan unterstützen wir nur die Profiländerung für Paare
      if (user.start_class) {
        await updateMyCoupleProfile(profileData);
        toast.success('Profil erfolgreich aktualisiert!');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await changeMyPassword(passwordData);
      toast.success('Passwort erfolgreich geändert!');
      // Formular zurücksetzen
      setPasswordData({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader
          color={"#3b82f6"} // Eine passende blaue Farbe
          loading={loading}
          size={50} // Größe des Spinners
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">      

      {/* Profil bearbeiten Formular für Paare */}
      {user && user.start_class && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Profil bearbeiten</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="mrs_first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vorname Dame
                </label>
                <input id="mrs_first_name" name="mrs_first_name" value={profileData.mrs_first_name} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <label htmlFor="mr_first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vorname Herr
                </label>
                <input id="mr_first_name" name="mr_first_name" value={profileData.mr_first_name} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300" />
              </div>
            </div>
      
            {/* Dropdowns für Startgruppe etc. (anstelle von Inputs für bessere UX) */}
            <div className="gap-4">
              <div>
                <label htmlFor="start_group" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Startgruppe
                </label>
                <select id="start_group" name="start_group" value={profileData.start_group} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300">
                  {START_GROUPS.map(group => <option key={group.value} value={group.value}>{group.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="start_class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Klasse
                </label>
                <select id="start_class" name="start_class" value={profileData.start_class} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300">
                  {START_CLASSES.map(cls => <option key={cls.value} value={cls.value}>{cls.label}</option>)}
                </select>
                <label htmlFor="start_class" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stiehl
                </label>
                <select name="dance_style" value={profileData.dance_style} onChange={handleProfileChange} required className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300">
                <option value="" disabled>Tanzstil auswählen...</option>
                  {DANCE_STYLES.map(style => <option key={style.value} value={style.value}>{style.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobilnummer
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={profileData.phone_number}
                onChange={handleProfileChange}
                placeholder="Mobilnummer (Optional)"
                className="shadow appearance-none border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-Mail (Login)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                disabled 
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Profil speichern
            </button>
          </form>
        </div>
      )}


      {/* Passwort ändern Formular */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Passwort ändern</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <input name="current_password" type="password" value={passwordData.current_password} onChange={handlePasswordChange} placeholder="Aktuelles Passwort" required className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          <input name="new_password" type="password" value={passwordData.new_password} onChange={handlePasswordChange} placeholder="Neues Passwort" required className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          <input name="confirm_new_password" type="password" value={passwordData.confirm_new_password} onChange={handlePasswordChange} placeholder="Neues Passwort bestätigen" required className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          <button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white font-bold py-2 px-4 rounded">Passwort ändern</button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;