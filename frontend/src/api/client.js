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

// NEU: Funktion zum Erstellen eines neuen Paares
export const createCouple = async (coupleData) => {
  try {
    const response = await apiClient.post('/api/v1/couples/', coupleData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Fehler beim Erstellen des Paares');
  }

};