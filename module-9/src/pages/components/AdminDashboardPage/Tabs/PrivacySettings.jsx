// PrivacySettings.jsx
import React, { useState } from 'react';

/**
 * PrivacySettings component
 * 
 * This component allows users to manage their privacy settings for their profile. 
 * Users can set visibility options for their activity and profile, determining who can see their information.
 * 
 * @param {object} props - The component props.
 * @param {object} props.privacySettings - The current privacy settings for the user, including activity and profile visibility.
 * @param {function} props.onUpdatePrivacy - Callback function to handle updates to the privacy settings, triggered when the user saves changes.
 * @returns {JSX.Element} The rendered privacy settings component, including dropdowns for visibility options and a save button.
 */
const PrivacySettings = ({ privacySettings, onUpdatePrivacy }) => {
  /**
   * The current state of the privacy settings.
   * 
   * This state holds the user's selected visibility options for activity and profile.
   * 
   * @type {object}
   * @property {string} activity - The visibility setting for user activity (e.g., 'public', 'friends_only', 'private').
   * @property {string} profile - The visibility setting for the user profile (e.g., 'public', 'friends_only', 'private').
   */
  const [settings, setSettings] = useState(privacySettings || { activity: 'public', profile: 'friends_only' });

  /**
   * Handles changes to the privacy settings.
   * 
   * This function updates the state with the new value for the specified setting key.
   * 
   * @param {string} key - The key of the setting to update (either 'activity' or 'profile').
   * @param {string} value - The new value of the setting, reflecting the user's choice.
   */
  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Handles saving the updated privacy settings.
   * 
   * This function triggers the callback to update the privacy settings in the parent component.
   */
  const handleSave = () => {
    onUpdatePrivacy(settings);
  };

  return (
    <div className="space-y-4" id="privacy-settings">
      {/* Activity Visibility Dropdown */}
      <div>
        <label className="block text-white mb-1" htmlFor="activity-visibility">Activity Visibility</label>
        <select
          id="activity-visibility"
          value={settings.activity}
          onChange={(e) => handleChange('activity', e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      {/* Profile Visibility Dropdown */}
      <div>
        <label className="block text-white mb-1" htmlFor="profile-visibility">Profile Visibility</label>
        <select
          id="profile-visibility"
          value={settings.profile}
          onChange={(e) => handleChange('profile', e.target.value)}
          className="w-full bg-gray-700 text-white p-2 rounded"
        >
          <option value="public">Public</option>
          <option value="friends_only">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      {/* Save Changes Button */}
      <button
        id="save-privacy-settings"
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default PrivacySettings;