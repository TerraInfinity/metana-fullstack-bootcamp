/**
 * AuthCallbackPage.jsx
 * Handles the OAuth callback by processing the token from the URL and redirecting the user.
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
      login(token);
      navigate('/home');
    } else {
      console.error('No token found in callback URL');
      navigate('/login');
    }
  }, [location, login, navigate]);

  return <div>Loading...</div>;
};
