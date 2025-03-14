/**
 * AuthContext.jsx
 * This file provides authentication context for the application, managing user authentication state and token storage.
 */
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

// Function to check if the token is still good
const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp >= currentTime ? decoded : null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      const decoded = validateToken(storedToken);
      if (decoded) {
        setToken(storedToken);
        setIsAuthenticated(true);
        console.log('Token is valid, user is authenticated');
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        console.log('Token invalid or expired, removed');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('User logged in, token set');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    console.log('User logged out, token removed');
  };

  // Use useMemo to make the app faster
  const value = useMemo(
    () => ({ isAuthenticated, token, loading, login, logout }),
    [isAuthenticated, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
