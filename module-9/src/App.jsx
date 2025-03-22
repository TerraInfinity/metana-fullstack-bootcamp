/**
 * App.jsx
 * Main application component that sets up routing for the application.
 * 
 * This component wraps the entire application in an AuthProvider to manage authentication state.
 * It defines the routes for the application, including public and private routes, 
 * as well as error handling routes for various HTTP status codes.
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CreateBlogPage } from './pages/CreateBlogPage';
import { PrivateRoute } from '../routes/frontend/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthCallbackPage } from './pages/callbacks/AuthCallbackPage';
import { AuthProvider } from './context/AuthContext'; // Add this import
// Import error pages
import NotFound from './pages/errors/NotFound';
import RestrictedAccess from './pages/errors/RestrictedAccess';
import UnauthorizedAccess from './pages/errors/UnauthorizedAccess';
import ServerError from './pages/errors/ServerError';

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
          <Route path="/blog/create" element={<CreateBlogPage />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          {/* Error Routes */}
          <Route path="/403" element={<RestrictedAccess />} />
          <Route path="/401" element={<UnauthorizedAccess />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;