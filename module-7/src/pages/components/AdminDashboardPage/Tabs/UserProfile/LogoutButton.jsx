/**
 * LogoutButton.jsx
 * A button component that triggers user logout.
 */
import React from 'react';

/**
 * LogoutButton component
 * 
 * This component renders a button that triggers user logout when clicked.
 * 
 * @param {function} onLogout - The function to call when the button is clicked.
 * @returns {JSX.Element} The rendered logout button component.
 */
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