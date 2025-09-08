// /DaSpCoRate/frontend/src/api/client.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Erstelle eine axios-Instanz
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Füge einen Interceptor hinzu, der den Token bei jeder Anfrage mitsendet
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funktion zum Anfordern eines Login-Tokens (jetzt mit axios)
export const loginUser = async (email, password) => {
  
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await apiClient.post('/api/v1/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login fehlgeschlagen');
  }

};

// Funktion zum Abrufen aller Paare mit axios
export const getCouples = async () => {
  try {
    const response = await apiClient.get('/api/v1/couples/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Paare');
  }
};

// Funktion zum Erstellen eines neuen Paares
export const createCouple = async (coupleData) => {
  try {
    const response = await apiClient.post('/api/v1/couples/', coupleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen des Paares');
  }

};

// Funktion zum Aktualisieren eines vorhandenen Paares
export const updateCouple = async (coupleId, coupleData) => {
  try {
    const response = await apiClient.put(`/api/v1/couples/${coupleId}`, coupleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren des Paares');
  }
};

// Funktion zum Löschen eines Paares
export const deleteCouple = async (coupleId) => {
  try {
    const response = await apiClient.delete(`/api/v1/couples/${coupleId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Löschen des Paares');
  }
};

// Holt die Daten des aktuell eingeloggten Benutzers
export const getMe = async () => {
  try {
    const response = await apiClient.get('/api/v1/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Profildaten');
  }
};

// Aktualisiert das Profil eines Paares
export const updateMyCoupleProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/v1/couples/me', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren des Profils');
  }
};

// Ändert das Passwort des aktuellen Benutzers
export const changeMyPassword = async (passwordData) => {
  try {
    await apiClient.put('/api/v1/users/me/password', passwordData);
    return { message: 'Passwort erfolgreich geändert.' };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Ändern des Passworts');
  }
};

// Funktion zum Abrufen aller Sessions eines Trainers
export const getSessions = async () => {
  try {
    const response = await apiClient.get('/api/v1/sessions/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Sessions');
  }
};

// Funktion zum Erstellen einer neuen Session
export const createSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/api/v1/sessions/', sessionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen der Session');
  }
};

// Holt die Details für eine einzelne Session
export const getSessionDetails = async (sessionId) => {
  try {
    const response = await apiClient.get(`/api/v1/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Session-Details');
  }
};

// Holt alle Anmeldungen (Paare) für eine Session
export const getEnrollmentsForSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/api/v1/enrollments/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Anmeldungen');
  }
};

// Holt alle Bewertungen für eine Session
export const getRatingsForSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/api/v1/ratings/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Bewertungen');
  }
};

// Erstellt eine neue Bewertung
export const createRating = async (ratingData) => {
  try {
    const response = await apiClient.post('/api/v1/ratings/', ratingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Speichern der Bewertung');
  }
};

// Funktion für Trainer, um ein Paar zu einer Session anzumelden
export const enrollCoupleByTrainer = async (sessionId, coupleId, startNumber) => {
  try {
    const response = await apiClient.post(
      `/api/v1/enrollments/by-trainer`,
      { session_id: sessionId, couple_id: coupleId, start_number: startNumber }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Anmelden des Paares');
  }
};

// Funktion zum Aktualisieren einer Bewertung
export const updateRating = async (ratingId, points) => {
  try {
    const response = await apiClient.put(`/api/v1/ratings/${ratingId}`, { points });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren der Bewertung');
  }
};

export const deleteSession = async (sessionId) => {
  try {
    // DELETE-Anfragen geben oft keinen Body zurück, daher erwarten wir eine 204-Antwort
    await apiClient.delete(`/api/v1/sessions/${sessionId}`);
    return true; // Erfolg
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Löschen der Session');
  }
};

// Funktion zum Löschen einer Anmeldung (Abmelden)
export const unenrollCouple = async (enrollmentId) => {
  try {
    await apiClient.delete(`/api/v1/enrollments/${enrollmentId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abmelden des Paares');
  }
};

// Funktion für ein Paar, um die eigene Bewertungshistorie abzurufen
export const getMyRatings = async () => {
  try {
    const response = await apiClient.get('/api/v1/ratings/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Bewertungen');
  }
};