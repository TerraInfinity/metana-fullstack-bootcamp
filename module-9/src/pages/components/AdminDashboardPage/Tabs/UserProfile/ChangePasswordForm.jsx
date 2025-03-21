// ChangePasswordForm.jsx
import React from 'react';

function ChangePasswordForm({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
}) {
  const isPasswordMismatch = newPassword && confirmNewPassword && newPassword !== confirmNewPassword;
  const isPasswordTooShort = newPassword && newPassword.length < 8;

  return (
    <div className="space-y-2">
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Current Password"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      <input
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        placeholder="Confirm New Password"
        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
        required
      />
      {isPasswordMismatch && <p className="text-red-500">Passwords do not match.</p>}
      {isPasswordTooShort && <p className="text-red-500">Password must be at least 8 characters.</p>}
    </div>
  );
}

export default ChangePasswordForm;