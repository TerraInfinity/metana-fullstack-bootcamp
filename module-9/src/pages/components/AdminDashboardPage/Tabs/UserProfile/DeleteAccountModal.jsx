/**
 * DeleteAccountModal.jsx
 * A modal component for confirming user account deletion.
 */
import React, { useState } from 'react';
import Modal from '../../../common/Modal';

/**
 * DeleteAccountModal component
 * 
 * This modal component prompts the user to confirm account deletion by entering their password.
 * It provides feedback on the deletion process and handles errors appropriately.
 * 
 * @param {boolean} isOpen - Indicates if the modal is currently open.
 * @param {function} onClose - Callback function to execute when the modal is closed.
 * @param {function} onDelete - Callback function to execute when the account deletion is confirmed.
 * @param {string} userId - The ID of the user whose account is to be deleted.
 * @param {string} token - The authentication token for the user, used for authorization.
 * @returns {JSX.Element} The rendered delete account modal component.
 */
function DeleteAccountModal({ isOpen, onClose, onDelete, userId, token }) {
  const [password, setPassword] = useState(''); // State to hold the user's password input
  const [error, setError] = useState(''); // State to hold any error messages

  /**
   * Handles the account deletion process.
   * Validates the password input and makes an API call to delete the account.
   * Displays error messages based on the outcome of the API call.
   */
  const handleDelete = async () => {
    if (!password) {
      setError('Password is required.'); // Error if password is not provided
      return;
    }

    try {
      // Call the delete API
      const response = await fetch(`/api/blogs/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }), // Send the password in the request body
      });

      if (response.ok) {
        onDelete(); // Callback for successful deletion (e.g., logout or redirect)
        onClose(); // Close the modal after successful deletion
      } else {
        setError('Failed to delete account. Please check your password.'); // Error for failed deletion
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); // General error handling
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-gray-900">
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
        <p className="mb-4">
          This action will permanently remove all data associated with your account. Are you sure you want to proceed?
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
          placeholder="Enter your password to confirm"
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>} // Display error message if exists
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDelete} // Trigger account deletion on button click
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Account
          </button>
          <button
            onClick={onClose} // Close the modal on button click
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteAccountModal;