// PrivacySettings.jsx
import React, { useState } from 'react';

/**
 * PrivacySettings component
 * 
 * This component manages the privacy settings for the user profile, allowing users to set visibility options for their activity and profile.
 * 
 * @param {object} props - The component props.
 * @param {object} props.privacySettings - The current privacy settings for the user.
 * @param {function} props.onUpdatePrivacy - Callback function to handle updates to the privacy settings.
 * @returns {JSX.Element} The rendered privacy settings component.
 */
const PrivacySettings = ({ privacySettings, onUpdatePrivacy }) => {
  /**
   * The current state of the privacy settings.
   * 
   * @type {object}
   */
  const [settings, setSettings] = useState(privacySettings || { activity: 'public', profile: 'friends_only' });

  /**
   * Handles changes to the privacy settings.
   * 
   * @param {string} key - The key of the setting to update.
   * @param {string} value - The new value of the setting.
   */
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handles saving the updated privacy settings.
   */
  const handleSave = () => {
    onUpdatePrivacy(settings);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white mb-1">Activity Visibility</label>
        <select
          value={settings.activity}
          onChange={(e) => handleChange('activity', e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label className="block text-white mb-1">Profile Visibility</label>
        <select
          value={settings.profile}
          onChange={(e) => handleChange('profile', e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default PrivacySettings;