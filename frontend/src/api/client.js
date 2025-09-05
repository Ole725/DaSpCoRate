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

// Funktion zum Abrufen aller Paare (jetzt mit axios)
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