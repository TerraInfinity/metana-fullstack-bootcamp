/**
 * AuthToggle.jsx
 * A component that toggles between login and registration views.
 */
import React, { useState } from 'react';

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