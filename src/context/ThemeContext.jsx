import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { showToast } = useToast();

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('cinemax_theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch (_err) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinemax_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.error('Failed to sync theme to DOM:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (showToast) {
        showToast(`Switched to ${nextTheme === 'dark' ? 'Dark 🌙' : 'Light ☀️'} Mode`, 'info');
      }
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
