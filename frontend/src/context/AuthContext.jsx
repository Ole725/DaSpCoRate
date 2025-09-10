// /DaSpCoRate/frontend/src/context/AuthContext.jsx (FINALE VERSION)
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getMe } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const validateTokenAndFetchUser = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMe();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateTokenAndFetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('authToken', data.access_token);
      
      // Jetzt holen wir die Benutzerdaten, um die Rolle zu bestimmen
      const userData = await getMe();
      setUser(userData);
      setIsAuthenticated(true);

      // Wir prüfen auf ein Attribut, das nur Trainer haben (z.B. last_name).
      const isTrainer = 'last_name' in userData;
      const targetPath = isTrainer ? '/dashboard' : '/couple-dashboard';
      console.log(`Login erfolgreich, navigiere zu: ${targetPath}`);
      navigate(targetPath); // Direkte Navigation

    } catch (error) {
      console.error("Login fehlgeschlagen:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = { isAuthenticated, user, login, logout, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);