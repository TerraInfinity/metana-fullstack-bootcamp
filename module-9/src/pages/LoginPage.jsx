/**
 * LoginPage.jsx
 * The main login and registration page, handling user authentication.
 * This component manages user login and registration processes, including form handling, API calls, and OAuth options.
 *
 * @component
 * @returns {JSX.Element} The rendered login page component.
 * @description This component allows users to log in or register using either email/password or OAuth methods. 
 * It handles the state for toggling between login and registration forms, as well as OAuth options.
 * 
 * @context {AuthContext} AuthContext - Provides authentication methods and state.
 * @state {boolean} isLogin - Indicates whether the user is in login mode.
 * @state {boolean} useOAuth - Indicates whether to display OAuth options.
 */
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import AuthForm from './components/LoginPage/AuthForm';
import AuthToggle from './components/LoginPage/AuthToggle';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [useOAuth, setUseOAuth] = useState(true); // State to toggle between form and OAuth
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const registerApiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/register`;
  const logonApiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/login`;

  // Handle email/password authentication (unchanged)
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
      console.error(data.message); // Error handling can be enhanced later
    }
  };

  // Handle OAuth login by redirecting to the backend's OAuth endpoint
  const handleOAuthLogin = (provider) => {
    const backendUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/auth/${provider}`;
    window.location.href = backendUrl;
  };

  // Dynamically set the title based on the mode
  const title = useOAuth ? 'Login with OAuth' : (isLogin ? 'Login' : 'Register');

  return (
    <Layout title={title}>
      {useOAuth ? (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => handleOAuthLogin('google')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#db4437', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with Google
          </button>
          <button
            onClick={() => handleOAuthLogin('github')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('twitter')}
            style={{ margin: '10px', padding: '10px', backgroundColor: '#1da1f2', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Login with Twitter
          </button>
          <p>
            <a
              href="#"
              onClick={() => setUseOAuth(false)}
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Use Email instead
            </a>
          </p>
        </div>
      ) : (
        <>
          <AuthForm isLogin={isLogin} onAuth={handleAuth} />
          <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
          <p>
            <a
              href="#"
              onClick={() => setUseOAuth(true)}
              style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Use OAuth instead
            </a>
          </p>
        </>
      )}
    </Layout>
  );
}