/**
 * AuthToggle.jsx
 * A component that toggles between login and registration views.
 * 
 * @component
 * @example
 * const isLogin = true;
 * const handleAuth = (data) => { handle authentication };
 * return <AuthForm isLogin={isLogin} onAuth={handleAuth} />;
 */
import React, { useState } from 'react';

/**
 * AuthForm component for handling user authentication.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isLogin - Indicates if the form is for login or registration.
 * @param {function} props.onAuth - Callback function to handle authentication with form data.
 * @returns {JSX.Element} The rendered AuthForm component.
 */
function AuthForm({ isLogin, onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = isLogin ? { email, password } : { name, email, password };
    onAuth(formData);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 bg-slate-900 border border-gray-700 rounded text-white"
          required={!isLogin}
        />
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 bg-slate-900 border border-gray-700 rounded text-white"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 bg-slate-900 border border-gray-700 rounded text-white"
        required
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}

/**
 * AuthToggle component for switching between login and registration views.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isLogin - Indicates if the current view is login.
 * @param {function} props.onToggle - Callback function to toggle between login and registration.
 * @returns {JSX.Element} The rendered AuthToggle component.
 */
function AuthToggle({ isLogin, onToggle }) {
  return (
    <div className="text-center p-4">
      <p>
        {isLogin ? "Need an account?" : 'Have an account?'}{' '}
        <button
          onClick={onToggle}
          className="text-blue-400 hover:underline"
          type="button"
          aria-label={isLogin ? 'Switch to Register' : 'Switch to Login'}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default AuthToggle;