/**
 * DeleteAccountModal.jsx
 * A modal component for confirming user account deletion.
 */
import React, { useState } from 'react';
import Modal from '../../../common/Modal'; // Corrected the import path

/**
 * DeleteAccountModal component
 * 
 * This modal component is used for confirming user account deletion.
 * It prompts the user to enter their password to confirm the deletion action.
 * 
 * @param {boolean} isOpen - Indicates if the modal is open.
 * @param {function} onClose - Function to call when the modal is closed.
 * @param {function} onDelete - Function to call when the account deletion is confirmed.
 * @param {string} userId - The ID of the user whose account is to be deleted.
 * @param {string} token - The authentication token for the user.
 * @returns {JSX.Element} The rendered delete account modal component.
 */
function DeleteAccountModal({ isOpen, onClose, onDelete, userId, token }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!password) {
      setError('Password is required.');
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
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onDelete(); // Callback for successful deletion (e.g., logout or redirect)
        onClose();
      } else {
        setError('Failed to delete account. Please check your password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm"
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Delete Account
          </button>
          <button
            onClick={onClose}
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