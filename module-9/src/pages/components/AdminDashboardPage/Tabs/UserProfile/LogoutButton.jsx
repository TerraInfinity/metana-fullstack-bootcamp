/**
 * LogoutButton.jsx
 * A React component that renders a button for user logout functionality.
 */
import React from 'react';

/**
 * LogoutButton component
 * 
 * This component renders a button that, when clicked, triggers the user logout process.
 * It is designed to be used in user profile or dashboard sections where logout functionality is needed.
 * 
 * @param {function} onLogout - The callback function to execute when the button is clicked.
 * This function should handle the logout logic, such as clearing user data and redirecting to the login page.
 * @returns {JSX.Element} The rendered logout button component, styled for visibility and user interaction.
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