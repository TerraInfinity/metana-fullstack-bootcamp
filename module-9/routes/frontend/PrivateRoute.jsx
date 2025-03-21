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
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered if the user is authenticated.
 * 
 * @returns {React.ReactNode} The children components if the user is authenticated, otherwise a redirect to the login page.
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Only show this message when testing the app
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  }

  if (loading) {
    return <div>Loading...</div>; // Wait while checking if the user is logged in
  }

  // If logged in, show the page; if not, send to login and remember where they were
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
};
