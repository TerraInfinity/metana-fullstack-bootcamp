/**
 * AuthContext.jsx
 * This file provides authentication context for the application, managing user authentication state and token storage.
 * It exports the AuthContext and provides functions for validating tokens and managing authentication state.
 */
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * AuthContext is a React context that manages user authentication state and token storage.
 */
export const AuthContext = createContext();

/**
 * Validates a given token by decoding it and checking its expiration time.
 * @param {string} token The token to validate.
 * @returns {object|null} The decoded token if it's valid, null otherwise.
 */
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

/**
 * AuthProvider is a React component that provides the AuthContext to its children.
 * It manages the authentication state and token storage.
 * @param {object} props The component props.
 * @param {ReactNode} props.children The children components.
 */
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

  /**
   * Logs the user in by setting the token and authentication state.
   * @param {string} newToken The new token to set.
   */
  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('User logged in, token set');
  };

  /**
   * Logs the user out by removing the token and authentication state.
   */
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

/**
 * Custom hook to use the AuthContext.
 * @returns {object} The authentication context value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};