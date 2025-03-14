// PrivacySettings.jsx
import React, { useState } from 'react';

const PrivacySettings = ({ privacySettings, onUpdatePrivacy }) => {
  const [settings, setSettings] = useState(privacySettings || { activity: 'public', profile: 'friends_only' });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

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