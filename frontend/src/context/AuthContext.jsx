// /DaSpCoRate/frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Wichtig: useNavigate importieren
import { loginUser, getMe } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // useNavigate Hook hier initialisieren

  const isAuthenticated = !!user;

  useEffect(() => {
    const validateTokenAndFetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateTokenAndFetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('authToken', data.access_token);
      
      const userData = await getMe();
      console.log("DATEN VOM /users/me ENDPUNKT:", userData);
      setUser(userData); // State aktualisieren

      switch (userData.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'trainer':
          navigate('/dashboard', { replace: true });
          break;
        case 'couple':
          navigate('/couple-dashboard', { replace: true });
          break;
        default:
          // Fallback, falls die Rolle unbekannt ist
          navigate('/login', { replace: true }); 
          break;
      }

    } catch (error) {
      console.error("Login fehlgeschlagen:", error);
      // Den Fehler weiterwerfen, damit die LoginPage ihn behandeln kann
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  const value = { isAuthenticated, user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);