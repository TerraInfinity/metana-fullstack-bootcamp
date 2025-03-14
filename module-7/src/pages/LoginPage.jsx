/**
 * LoginPage.jsx
 * The main login and registration page, handling user authentication.
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/common/Layout'; // Import the Layout component
import AuthForm from './components/LoginPage/AuthForm';
import AuthToggle from './components/LoginPage/AuthToggle';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiPort = process.env.REACT_APP_BACKEND_PORT; 
  const registerApiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/register`;
  const logonApiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/login`;

  const handleAuth = async (formData) => {
    const url = isLogin ? logonApiUrl : registerApiUrl;
    const body = isLogin 
      ? JSON.stringify({ email: formData.email, password: formData.password }) 
      : JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, isAdmin: false });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
    const data = await response.json();
    if (response.ok) {
      login(data.token);
      navigate(isLogin ? '/home' : '/login');
    } else {
      console.error(data.message); // Error handling can be added later if needed
    }
  };

  return (
    <Layout title={isLogin ? 'Login' : 'Register'}>
      <AuthForm isLogin={isLogin} onAuth={handleAuth} />
      <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
    </Layout>
  );
}

