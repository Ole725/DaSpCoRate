// /DaSpCoRate/frontend/src/api/client.js

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: baseURL,
});

export default apiClient;

// Fügt bei jeder Anfrage automatisch den Auth-Token hinzu.
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

// --- AUTH FUNKTIONEN ---
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  try {
    const response = await apiClient.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login fehlgeschlagen');
  }
};

export const getMe = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Profildaten');
  }
};

export const changeMyPassword = async (passwordData) => {
  try {
    await apiClient.put('/users/me/password', passwordData);
    return { message: 'Passwort erfolgreich geändert.' };
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Ändern des Passworts');
  }
};


// --- PAAR-FUNKTIONEN (COUPLES) ---

export const getCouples = async () => {
  try {
    const response = await apiClient.get('/couples/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Paare');
  }
};

export const createCouple = async (coupleData) => {
  try {
    const response = await apiClient.post('/couples/', coupleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen des Paares');
  }
};

// Holt alle Wertungen für eine spezifische Paar-ID
export const getRatingsByCoupleId = async (coupleId) => {
  const response = await apiClient.get(`/ratings/couple/${coupleId}`);
  return response.data;
};

// Holt die Detail-Informationen für eine spezifische Paar-ID
export const getCoupleById = async (coupleId) => {
  const response = await apiClient.get(`/couples/${coupleId}`);
  return response.data;
};

export const updateCouple = async (coupleId, coupleData) => {
  try {
    const response = await apiClient.put(`/couples/${coupleId}`, coupleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren des Paares');
  }
};

export const deleteCouple = async (coupleId) => {
  try {
    await apiClient.delete(`/couples/${coupleId}`);
    return { message: 'Paar erfolgreich gelöscht.' }; // Bessere Rückgabe
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Löschen des Paares');
  }
};

export const updateMyCoupleProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/couples/me', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren des Profils');
  }
};


// --- SESSION-FUNKTIONEN ---

export const getSessions = async () => {
  try {
    const response = await apiClient.get('/sessions/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Trainings');
  }
};

export const createSession = async (sessionData) => {
  try {
    const response = await apiClient.post('/sessions/', sessionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen des Trainings');
  }
};

export const updateSession = async (sessionId, sessionData) => {
    const response = await apiClient.put(`/sessions/${sessionId}`, sessionData);
    return response.data;
};

export const getSessionDetails = async (sessionId) => {
  try {
    const response = await apiClient.get(`/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Trainings-Details');
  }
};

export const deleteSession = async (sessionId) => {
  try {
    await apiClient.delete(`/sessions/${sessionId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Löschen des Trainings');
  }
};


// --- ANMELDUNGS-FUNKTIONEN (ENROLLMENTS) ---

export const getEnrollmentsForSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/enrollments/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Anmeldungen');
  }
};

export const enrollCoupleByTrainer = async (sessionId, coupleId, startNumber) => {
  try {
    const response = await apiClient.post('/enrollments/by-trainer', {
      session_id: sessionId,
      couple_id: coupleId,
      start_number: startNumber,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Anmelden des Paares');
  }
};

export const unenrollCouple = async (enrollmentId) => {
  try {
    await apiClient.delete(`/enrollments/${enrollmentId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abmelden des Paares');
  }
};


// --- BEWERTUNGS-FUNKTIONEN (RATINGS) ---

export const getRatingsForSession = async (sessionId) => {
  try {
    const response = await apiClient.get(`/ratings/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Bewertungen');
  }
};

export const createRating = async (ratingData) => {
  try {
    const response = await apiClient.post('/ratings/', ratingData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Speichern der Bewertung');
  }
};

export const updateRating = async (ratingId, points) => {
  try {
    const response = await apiClient.put(`/ratings/${ratingId}`, { points });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren der Bewertung');
  }
};

export const getMyRatings = async () => {
  try {
    const response = await apiClient.get('/ratings/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Bewertungen');
  }
};


// --- KONTAKT-FUNKTION ---

export const sendContactForm = async (formData) => {
  try {
    const response = await apiClient.post('/contact', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Senden der Nachricht');
  }
};


// --- ADMIN-FUNKTIONEN ---

export const getAllCouples = async () => { 
  try {
    // Der Endpunkt /couples/all existiert bereits im Backend
    const response = await apiClient.get('/couples/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Paare');
  }
};

export const getAllSessionsForAdmin = async () => {
  try {
    const response = await apiClient.get('/sessions/all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen aller Trainings');
  }
};

// Holt die Liste der Paare, deren Einwilligung aussteht
export const getPendingConsentCouples = async () => {
  const response = await apiClient.get('/consent/admin/pending-consent');
  return response.data;
};

// Löst den Versand der Einwilligungs-E-Mails aus
export const sendConsentEmails = async () => {
  const response = await apiClient.post('/consent/admin/send-consent-emails');
  return response.data;
};

export const getAdminStats = async () => {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Admin-Statistiken');
  }
};

// --- TRAINER-VERWALTUNG (NUR ADMIN) ---

export const getTrainers = async () => {
  try {
    const response = await apiClient.get('/trainers/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Abrufen der Trainer');
  }
};

export const createTrainer = async (trainerData) => {
  try {
    const response = await apiClient.post('/trainers/', trainerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen des Trainers');
  }
};

export const updateTrainer = async (trainerId, trainerData) => {
  try {
    const response = await apiClient.put(`/trainers/${trainerId}`, trainerData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Aktualisieren des Trainers');
  }
};

export const deleteTrainer = async (trainerId) => {
  try {
    // Bei DELETE erwarten wir oft keine Daten zurück, nur einen Erfolgsstatus
    await apiClient.delete(`/trainers/${trainerId}`);
    return true; 
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Löschen des Trainers');
  }
};