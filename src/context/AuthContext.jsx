import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeContext';
import { useBooking } from './BookingContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const toastState = useToast();
  const themeState = useTheme();
  const bookingState = useBooking();

  return {
    ...context,
    ...toastState,
    ...themeState,
    ...bookingState,
  };
};

const INITIAL_DEMO_USERS = [
  {
    id: 'usr_demo_1',
    name: 'Manikanta',
    email: 'manikanta@movie.com',
    password: 'Password123!',
    phone: '+91 98765 43210',
    joinedDate: '2025-01-15',
    membership: 'VIP Gold Member',
  },
];

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  // Current active user session state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('cinemax_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error loading current user from localStorage:', e);
      return null;
    }
  });

  // Registered users database in localStorage
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const savedDb = localStorage.getItem('cinemax_users_db');
      if (savedDb) {
        return JSON.parse(savedDb);
      } else {
        localStorage.setItem('cinemax_users_db', JSON.stringify(INITIAL_DEMO_USERS));
        return INITIAL_DEMO_USERS;
      }
    } catch (e) {
      console.error('Error loading users DB from localStorage:', e);
      return INITIAL_DEMO_USERS;
    }
  });

  // Sync users database changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cinemax_users_db', JSON.stringify(usersDb));
    } catch (e) {
      console.error('Failed to save users database to localStorage:', e);
    }
  }, [usersDb]);

  // Sync current user session changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('cinemax_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('cinemax_current_user');
      }
    } catch (e) {
      console.error('Failed to save current user session:', e);
    }
  }, [currentUser]);

  // User Login Handler
  const login = async (email, password) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = usersDb.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!foundUser) {
      if (showToast) showToast('No account found with this email address.', 'error');
      return { success: false, error: 'Account not found. Please register first.' };
    }

    if (foundUser.password !== password) {
      if (showToast) showToast('Invalid password. Please try again.', 'error');
      return { success: false, error: 'Incorrect password.' };
    }

    const userSession = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone || '+91 90000 00000',
      joinedDate: foundUser.joinedDate || new Date().toISOString().split('T')[0],
      membership: foundUser.membership || 'Standard Member',
    };

    setCurrentUser(userSession);
    if (showToast) showToast(`Welcome back, ${foundUser.name}! 👋`, 'success');
    return { success: true, user: userSession };
  };

  // User Registration Handler
  const register = async (userData) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = userData.email.trim().toLowerCase();
    const existingUser = usersDb.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      if (showToast) showToast('An account with this email already exists.', 'error');
      return { success: false, error: 'Email already registered. Try logging in.' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      phone: userData.phone || '+91 98765 00000',
      joinedDate: new Date().toISOString().split('T')[0],
      membership: 'Silver Member',
    };

    const updatedDb = [...usersDb, newUser];
    setUsersDb(updatedDb);

    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      joinedDate: newUser.joinedDate,
      membership: newUser.membership,
    };

    setCurrentUser(userSession);
    if (showToast) showToast('Registration successful! Welcome to MovieMax 🎉', 'success');
    return { success: true, user: userSession };
  };

  // User Password Reset Handler
  const resetPassword = async (email, newPassword) => {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = usersDb.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (userIndex === -1) {
      if (showToast) showToast('No user found with this email.', 'error');
      return { success: false, error: 'Email not found in our system.' };
    }

    const updatedDb = [...usersDb];
    updatedDb[userIndex].password = newPassword;
    setUsersDb(updatedDb);

    if (showToast) showToast('Password reset successfully! You can now login.', 'success');
    return { success: true };
  };

  // User Logout Handler
  const logout = () => {
    setCurrentUser(null);
    if (showToast) showToast('You have been logged out safely.', 'info');
  };

  const value = {
    currentUser,
    usersDb,
    login,
    register,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
