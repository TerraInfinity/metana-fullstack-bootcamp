/**
 * AuthForm.jsx
 * A form component for user authentication, handling both login and registration.
 *
 * @component
 * @param {boolean} isLogin - Indicates if the form is for login (true) or registration (false).
 * @param {function} onAuth - Callback function to handle authentication, receives form data as an argument.
 * @returns {JSX.Element} The rendered form component for user authentication.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthForm({ isLogin, onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin && password && confirmPassword && password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  }, [password, confirmPassword, isLogin]);

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }, [isLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const formData = isLogin ? { email, password } : { name, email, password };
    onAuth(formData).then((response) => {
      if (!isLogin) {
        navigate('/home');
      }
    });
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      {!isLogin && (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          required={!isLogin}
        />
      )}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      {!isLogin && (
        <>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={`w-full p-2 bg-gray-800 border rounded text-white ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}

export default AuthForm;