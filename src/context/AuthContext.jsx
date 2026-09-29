import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Seed initial default demo user if DB is empty
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
  // Current active user
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

  // Global Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

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

  // Real-time login handler
  const login = async (email, password) => {
    // Artificial latency for realistic async feel
    await new Promise((res) => setTimeout(res, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = usersDb.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!foundUser) {
      showToast('No account found with this email address.', 'error');
      return { success: false, error: 'Account not found. Please register first.' };
    }

    if (foundUser.password !== password) {
      showToast('Invalid password. Please try again.', 'error');
      return { success: false, error: 'Incorrect password.' };
    }

    // Login successful
    const userSession = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      phone: foundUser.phone || '+91 90000 00000',
      joinedDate: foundUser.joinedDate || new Date().toISOString().split('T')[0],
      membership: foundUser.membership || 'Standard Member',
    };

    setCurrentUser(userSession);
    showToast(`Welcome back, ${foundUser.name}! 👋`, 'success');
    return { success: true, user: userSession };
  };

  // Real-time register handler
  const register = async (userData) => {
    await new Promise((res) => setTimeout(res, 600));

    const normalizedEmail = userData.email.trim().toLowerCase();
    const existingUser = usersDb.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      showToast('An account with this email already exists.', 'error');
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

    // Auto-login registered user
    const userSession = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      joinedDate: newUser.joinedDate,
      membership: newUser.membership,
    };

    setCurrentUser(userSession);
    showToast('Registration successful! Welcome to MovieMax 🎉', 'success');
    return { success: true, user: userSession };
  };

  // Real-time password reset handler
  const resetPassword = async (email, newPassword) => {
    await new Promise((res) => setTimeout(res, 600));

    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = usersDb.findIndex(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (userIndex === -1) {
      showToast('No user found with this email.', 'error');
      return { success: false, error: 'Email not found in our system.' };
    }

    const updatedDb = [...usersDb];
    updatedDb[userIndex].password = newPassword;
    setUsersDb(updatedDb);

    showToast('Password reset successfully! You can now login.', 'success');
    return { success: true };
  };

  // Real-time logout handler
  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  // Dynamic user bookings state starting at [] by default
  const [userBookings, setUserBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem('cinemax_user_bookings');
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinemax_user_bookings', JSON.stringify(userBookings));
    } catch (e) {
      console.error('Failed to sync bookings to localStorage:', e);
    }
  }, [userBookings]);

  const addBooking = (bookingData) => {
    const newBooking = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      customer: currentUser?.name || bookingData.customer || 'Manikanta',
      movie: bookingData.movie || 'Deadpool & Wolverine',
      theater: bookingData.theater || 'AMB Cinemas',
      seats: bookingData.seats || 'Recliner A-12',
      amount: bookingData.amount || 350,
      status: 'Confirmed 🟢',
      time: 'Just now',
      timestamp: Date.now(),
    };

    setUserBookings((prev) => [newBooking, ...prev]);
    showToast(`🎟️ Ticket Booked Successfully! ID: ${newBooking.id}`, 'success');
    return newBooking;
  };

  const clearBookings = () => {
    setUserBookings([]);
    showToast('Cleared all bookings state back to 0.', 'info');
  };

  // Global Theme state (dark vs light)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('cinemax_theme');
      return savedTheme === 'light' ? 'light' : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Sync active theme class to document element & localStorage
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
      showToast(`Switched to ${nextTheme === 'dark' ? 'Dark 🌙' : 'Light ☀️'} Mode`, 'info');
      return nextTheme;
    });
  };

  const value = {
    currentUser,
    usersDb,
    userBookings,
    addBooking,
    clearBookings,
    login,
    register,
    resetPassword,
    logout,
    toast,
    showToast,
    theme,
    toggleTheme,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
