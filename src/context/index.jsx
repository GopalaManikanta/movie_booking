import React from 'react';
import { ToastProvider } from './ToastContext';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { BookingProvider } from './BookingContext';

export { useToast, ToastProvider } from './ToastContext';
export { useTheme, ThemeProvider } from './ThemeContext';
export { useAuth, AuthProvider } from './AuthContext';
export { useBooking, BookingProvider } from './BookingContext';

export const AppProviders = ({ children }) => {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
};

export default AppProviders;
