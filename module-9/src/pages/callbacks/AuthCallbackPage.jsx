/**
 * AuthCallbackPage.jsx
 * This component handles the OAuth callback by processing the token received from the URL.
 * It extracts the token, logs the user in using the token, and redirects the user based on the token's presence.
 * 
 * OAuth Flow:
 * 1. The user is redirected back to this page after authentication.
 * 2. The token is extracted from the URL parameters.
 * 3. If a token is present, the user is logged in and redirected to the home page.
 * 4. If no token is found, an error is logged and the user is redirected to the login page.
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    console.log('Callback Token:', token);

    if (token) {
      // If a token is found, log the user in and redirect to the home page
      login(token);
      navigate('/home');
    } else {
      // If no token is found, log an error and redirect to the login page
      console.error('No token found in callback URL');
      navigate('/login');
    }
  }, [location, login, navigate]);

  return <div id="auth-callback-loading">Loading...</div>;
};
