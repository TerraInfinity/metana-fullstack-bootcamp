import React, { useEffect } from 'react';

function ChangePasswordForm({
    setCurrentPassword,
    setNewPassword,
    setConfirmNewPassword,
    currentPassword,
    newPassword,
    confirmNewPassword,
}) {
    const [error, setError] = React.useState('');

    const isPasswordMismatch = newPassword && confirmNewPassword && newPassword !== confirmNewPassword;
    const isPasswordTooShort = newPassword && newPassword.length < 8;

    useEffect(() => {
        if (isPasswordMismatch) {
            setError('Passwords do not match.');
        } else if (isPasswordTooShort) {
            setError('Password must be at least 8 characters.');
        } else {
            setError('');
        }
    }, [newPassword, confirmNewPassword]);

    return (
        <div className="space-y-2">
            <div>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>
            <div>
                <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ChangePasswordForm;