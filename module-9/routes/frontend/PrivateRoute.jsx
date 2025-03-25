// src/components/common/PrivateRoute.jsx
/**
 * PrivateRoute component is used to protect routes that require authentication.
 * It checks if the user is authenticated and either renders the children components
 * or redirects to the login page.
 * 
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered if the user is authenticated.
 * 
 * @returns {React.ReactNode} The children components if the user is authenticated, otherwise a redirect to the login page.
 */
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/context/AuthContext';

/**
 * PrivateRoute component.
 * 
 * This component serves as a wrapper for routes that require the user to be authenticated.
 * It utilizes the AuthContext to determine the authentication status of the user.
 * If the user is authenticated, it renders the specified children components.
 * If the user is not authenticated, it redirects them to the login page, preserving the 
 * current location in the state for potential redirection after successful login.
 * 
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered if the user is authenticated.
 * 
 * @returns {React.ReactNode} The children components if the user is authenticated, otherwise a redirect to the login page.
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Log authentication status during development for debugging purposes
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  }

  if (loading) {
    return <div id="loading-message">Loading...</div>; // Display a loading message while checking authentication status
  }

  // Render children if authenticated; otherwise, redirect to login and remember the current location
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} id="redirect-login" />;
};
