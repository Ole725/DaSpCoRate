// /DaSpCoRate/frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Erstelle den Kontext
const ThemeContext = createContext();

// 2. Erstelle den Provider - die "Gehirn"-Komponente
export const ThemeProvider = ({ children }) => {
  // Wir initialisieren den State mit einer Funktion, um sofort zu prüfen,
  // was der Nutzer zuletzt gespeichert hat oder was sein System bevorzugt.
  const [theme, setTheme] = useState(() => {
    // Gibt es ein gespeichertes Theme im Browser?
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Wenn nicht, prüfen wir die bevorzugte Einstellung des Betriebssystems
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Dieser Effekt wird immer dann ausgeführt, wenn sich `theme` ändert.
  // Er ist verantwortlich für die DOM-Manipulation.
  useEffect(() => {
    const root = window.document.documentElement; // Das ist das <html>-Tag

    // Entferne die alte Klasse, egal welche es war
    root.classList.remove('light', 'dark');
    
    // Füge die neue, korrekte Klasse hinzu
    root.classList.add(theme);

    // Speichere die aktuelle Auswahl des Nutzers für zukünftige Besuche
    localStorage.setItem('theme', theme);
  }, [theme]); // Abhängigkeit: Führe den Effekt nur aus, wenn `theme` sich ändert

  // Die Funktion, die der Rest der App aufrufen wird, um das Theme zu wechseln
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Stelle den aktuellen Theme-Zustand und die Umschalt-Funktion
  // allen Kindern dieses Providers zur Verfügung.
  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Erstelle einen benutzerdefinierten Hook für einfachen Zugriff
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};