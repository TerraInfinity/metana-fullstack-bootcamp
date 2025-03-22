/**
 * App.jsx
 * Main application component that sets up routing for the application.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { PrivateRoute } from '../routes/frontend/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthCallbackPage } from './pages/callbacks/AuthCallbackPage';
import { AuthProvider } from './context/AuthContext'; // Add this import

function App() {
  return (
    <AuthProvider> {/* Wrap Router with AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile/:id" element={<PublicProfilePage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;