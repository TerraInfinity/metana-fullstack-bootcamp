/**
 * LogoutButton.jsx
 * A button component that triggers user logout.
 */
import React from 'react';

function LogoutButton({ onLogout }) {
    return (
      <div className="text-center p-4">
        <button
          onClick={onLogout}
          className="w-full max-w-md p-2 bg-red-600 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );
  }
  
  export default LogoutButton;