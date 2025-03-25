/**
 * AuthContext.jsx
 * This file provides the authentication context for the application, managing user authentication state,
 * token storage, and providing functions for logging in and out.
 * It exports the AuthContext and the AuthProvider component.
 */
import React, { createContext, useState, useEffect, useMemo, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

/**
 * Default user object representing an unauthenticated user.
 * @type {object}
 * @property {string|null} role - The role of the user, default is null.
 */
const defaultUser = { role: null };

/**
 * AuthContext is a React context that provides authentication state and methods.
 * It includes information about whether the user is authenticated, user details, loading state,
 * and functions to log in and log out.
 * @type {object}
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {object} user - The current user object.
 * @property {boolean} loading - Indicates if the authentication state is still loading.
 * @property {function} login - Function to log in the user.
 * @property {function} logout - Function to log out the user.
 */
export const AuthContext = createContext({
  isAuthenticated: false,
  user: defaultUser,
  loading: true,
  login: () => {},
  logout: () => {},
});

/**
 * Validates a given JWT token by decoding it and checking its expiration time.
 * If the token is valid, it returns the decoded token; otherwise, it returns null.
 * @param {string} token - The JWT token to validate.
 * @returns {object|null} The decoded token if valid, null otherwise.
 */
const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded); // Log the full decoded payload
    const currentTime = Date.now() / 1000;
    return decoded.exp >= currentTime ? decoded : null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * AuthProvider is a React component that provides the AuthContext to its children.
 * It manages the authentication state, including token storage and user details.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components that will have access to the AuthContext.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    console.log('Stored token from localStorage:', storedToken); // Log the raw token
    if (storedToken) {
      const decoded = validateToken(storedToken);
      if (decoded) {
        const newUser = { id: decoded.id, role: decoded.role || null };
        setUser(newUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        console.log('Token is valid, user set to:', newUser); // Log the updated user
      } else {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        console.log('Token invalid or expired, removed');
      }
    } else {
      console.log('No token found in localStorage');
    }
    setLoading(false);
  }, []);

  /**
   * Logs the user in by setting the token and updating the authentication state.
   * It decodes the token to extract user information and updates the context state.
   * @param {string} newToken - The new JWT token to set for the user.
   */
  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    const decoded = jwtDecode(newToken);
    setUser({ id: decoded.id, role: decoded.role || null });
    setToken(newToken);
    setIsAuthenticated(true);
    console.log('User logged in, token set, user:', { id: decoded.id, role: decoded.role });
    // Added ID for testing purposes
    console.log('Login action ID: login-button'); // ID for the login action
  };

  /**
   * Logs the user out by removing the token from local storage and resetting the authentication state.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(defaultUser);
    console.log('User logged out, token removed');
    // Added ID for testing purposes
    console.log('Logout action ID: logout-button'); // ID for the logout action
  };

  // Use useMemo to optimize performance by memoizing the context value
  const value = useMemo(
    () => ({ isAuthenticated, user, token, loading, login, logout }),
    [isAuthenticated, user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 * @returns {object} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};