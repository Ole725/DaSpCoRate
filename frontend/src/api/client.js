// /DaSpCoRate/frontend/src/api/client.js

const API_BASE_URL = 'http://127.0.0.1:8000'; // Die URL unseres FastAPI-Backends

// Funktion zum Anfordern eines Login-Tokens
export const loginUser = async (email, password) => {
  // Das FastAPI /token-Endpunkt erwartet Form-Daten, nicht JSON
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    // Bei Fehlern wie 401 Unauthorized werfen wir einen Fehler, den wir in der Komponente fangen können
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login fehlgeschlagen');
  }

  // Bei Erfolg geben wir die JSON-Antwort (mit dem Token) zurück
  return await response.json();
};

// Funktion zum Abrufen aller Paare (geschützter Endpunkt)
export const getCouples = async () => {
  // Token aus dem Local Storage holen
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Kein Authentifizierungs-Token gefunden.');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/couples/`, {
    method: 'GET',
    headers: {
      // Token im Authorization-Header mitsenden
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    // Bei Fehlern wie 401 Unauthorized oder 403 Forbidden
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Fehler beim Abrufen der Paare');
  }

  return await response.json();
};