// SiteSettings.jsx
import React, { useState } from 'react';
import ChooseYourPath from './ChooseYourPath';

/**
 * SiteSettings component allows users to configure site settings, including enabling NSFW content and selecting preferred content categories.
 *
 * This component provides a user interface for managing site preferences, allowing users to toggle NSFW content and select from a variety of content categories.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.settings - The current settings for the site, including:
 *   @param {boolean} props.settings.nsfwEnabled - Indicates if NSFW content is enabled.
 *   @param {Array<string>} props.settings.selectedCategories - The currently selected content categories.
 *   @param {string} props.settings.selectedPath - The currently selected path for content.
 * @param {Function} props.onUpdateSettings - Callback function to update the settings when changes are made.
 */
const SiteSettings = ({ settings = {}, onUpdateSettings }) => {
  // State for managing NSFW toggle and selected categories
  const [nsfwEnabled, setNsfwEnabled] = useState(settings.nsfwEnabled || false); // Tracks if NSFW content is enabled
  const [selectedCategories, setSelectedCategories] = useState(settings.selectedCategories || []); // Tracks selected content categories
  const [selectedPath, setSelectedPath] = useState(settings.selectedPath || ''); // Tracks the selected path

  // List of available content categories for user selection
  const categories = [
    'Articles', 'Audio', 'Video', 'Spiritual', 'Educational', 'Entertainment',
    'Glaum-Inspired', 'Chaos Manual Inspired', 'Bambi Inspired', 'Crystal Inspired',
    'Political', 'Low Vibrational NSFW', 'High Vibrational NSFW', 'Experimental NSFW',
    'Miscellaneous', 'Community Created', 'Web3 Entrepreneurial'
  ];

  /**
   * Handles changes to the selected categories by toggling the category's inclusion in the selected list.
   * 
   * This function updates the selectedCategories state based on whether the category is already selected or not.
   * 
   * @param {string} category - The category that was toggled (added or removed).
   */
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  /**
   * Handles the selection of a path by updating the selectedPath state.
   * 
   * This function sets the selectedPath to the provided path.
   * 
   * @param {string} path - The selected path to be set.
   */
  const handleSelectPath = (path) => {
    setSelectedPath(path);
  };

  /**
   * Saves the current settings when the user clicks the save button.
   * 
   * This function triggers the onUpdateSettings callback with the current settings, including NSFW status, selected categories, and selected path.
   */
  const handleSave = () => {
    onUpdateSettings({ nsfwEnabled, selectedCategories, selectedPath });
  };

  return (
    <div className="space-y-6">
      <ChooseYourPath
        onSelectPath={handleSelectPath}
        selectedPath={selectedPath}
      />
      {/* Content Categories */}
      <div>
        <label className="block text-white mb-1">Preferred Content Categories</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Articles')}
                onChange={() => handleCategoryChange('Articles')}
                className="mr-2"
              />
              <span className="text-white">Articles</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Educational')}
                onChange={() => handleCategoryChange('Educational')}
                className="mr-2"
              />
              <span className="text-white">Educational</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Spiritual')}
                onChange={() => handleCategoryChange('Spiritual')}
                className="mr-2"
              />
              <span className="text-white">Spiritual</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Community Created')}
                onChange={() => handleCategoryChange('Community Created')}
                className="mr-2"
              />
              <span className="text-white">Community Created</span>
            </div>
          </div>
          <div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Audio')}
                onChange={() => handleCategoryChange('Audio')}
                className="mr-2"
              />
              <span className="text-white">Audio</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Entertainment')}
                onChange={() => handleCategoryChange('Entertainment')}
                className="mr-2"
              />
              <span className="text-white">Entertainment</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Video')}
                onChange={() => handleCategoryChange('Video')}
                className="mr-2"
              />
              <span className="text-white">Video</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Miscellaneous')}
                onChange={() => handleCategoryChange('Miscellaneous')}
                className="mr-2"
              />
              <span className="text-white">Miscellaneous</span>
            </div>
          </div>
          <div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Glaum-Inspired')}
                onChange={() => handleCategoryChange('Glaum-Inspired')}
                className="mr-2"
              />
              <span className="text-white">Glaum-Inspired</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Chaos Manual Inspired')}
                onChange={() => handleCategoryChange('Chaos Manual Inspired')}
                className="mr-2"
              />
              <span className="text-white">Chaos Manual Inspired</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Bambi Inspired')}
                onChange={() => handleCategoryChange('Bambi Inspired')}
                className="mr-2"
              />
              <span className="text-white">Bambi Inspired</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Web3 Entrepreneurial')}
                onChange={() => handleCategoryChange('Web3 Entrepreneurial')}
                className="mr-2"
              />
              <span className="text-white">Web3 Entrepreneurial</span>
            </div>
          </div>
          <div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Political')}
                onChange={() => handleCategoryChange('Political')}
                className="mr-2"
              />
              <span className="text-white">Political</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Low Vibrational NSFW')}
                onChange={() => handleCategoryChange('Low Vibrational NSFW')}
                className="mr-2"
              />
              <span className="text-white">Low Vibrational NSFW</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('High Vibrational NSFW')}
                onChange={() => handleCategoryChange('High Vibrational NSFW')}
                className="mr-2"
              />
              <span className="text-white">High Vibrational NSFW</span>
            </div>
            <div>
              <input
                type="checkbox"
                checked={selectedCategories.includes('Experimental NSFW')}
                onChange={() => handleCategoryChange('Experimental NSFW')}
                className="mr-2"
              />
              <span className="text-white">Experimental NSFW</span>
            </div>
          </div>
        </div>
      </div>

      {/* NSFW Toggle and Bambi Sleep Content Options in 2 Rows */}
      <div>
        <label className="block text-white mb-1">Enable NSFW Content</label>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes('NSFW Content')}
                onChange={() => handleCategoryChange('NSFW Content')}
                className="mr-2"
              />
              <span className="text-white">Enable Not Safe For Work (NSFW) content</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes('Original Bambi Sleep Content')}
                onChange={() => handleCategoryChange('Original Bambi Sleep Content')}
                className="mr-2"
              />
              <span className="text-white">Enable Original Bambi Sleep Content</span>
            </div>
          </div>
          <div className="flex flex-row gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes('Third-party Bambi Sleep Community Content')}
                onChange={() => handleCategoryChange('Third-party Bambi Sleep Community Content')}
                className="mr-2"
              />
              <span className="text-white">Enable Third-party Bambi Sleep Community Content</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes('Other Hypnosis Artist Content')}
                onChange={() => handleCategoryChange('Other Hypnosis Artist Content')}
                className="mr-2"
              />
              <span className="text-white">Enable Other Hypnosis Artist Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save Settings
      </button>
    </div>
  );
};

export default SiteSettings;