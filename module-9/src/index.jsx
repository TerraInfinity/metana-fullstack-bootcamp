/**
 * index.jsx
 * Entry point for the React application that renders the App component.
 * This file sets up the React application and wraps it with the AuthProvider for managing authentication state.
 * 
 * The AuthProvider component provides context for authentication, allowing child components to access
 * authentication state and methods. The App component is the main application component that contains
 * the application's routing and UI structure.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tailwind.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);