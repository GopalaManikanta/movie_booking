import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ToastNotification from './components/ToastNotification';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MovieCatalog from './pages/MovieCatalog';
import MovieDetails from './pages/MovieDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen w-full flex flex-col bg-black text-white overflow-x-hidden">
          <ToastNotification />
          <main className="flex-1 w-full m-0 p-0 overflow-x-hidden">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Cinema Dashboard & Movie Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies"
                element={
                  <ProtectedRoute>
                    <MovieCatalog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movie/:id"
                element={
                  <ProtectedRoute>
                    <MovieDetails />
                  </ProtectedRoute>
                }
              />

              {/* Default Home & Catch-all redirect straight to Login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
