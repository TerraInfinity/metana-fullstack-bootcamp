// SiteSettings.jsx
import React, { useState } from 'react';
import ChooseYourPath from './ChooseYourPath';

const SiteSettings = ({ settings = {}, onUpdateSettings }) => {
  // State for NSFW toggle and selected categories
  const [nsfwEnabled, setNsfwEnabled] = useState(settings.nsfwEnabled || false);
  const [selectedCategories, setSelectedCategories] = useState(settings.selectedCategories || []);
  const [selectedPath, setSelectedPath] = useState(settings.selectedPath || '');

  // List of available content categories
  const categories = [
    'Articles', 'Audio', 'Video', 'Spiritual', 'Educational', 'Entertainment',
    'Glaum-Inspired', 'Chaos Manual Inspired', 'Bambi Inspired', 'Crystal Inspired',
    'Political', 'Low Vibrational NSFW', 'High Vibrational NSFW', 'Experimental NSFW',
    'Miscellaneous', 'Community Created', 'Web3 Entrepreneurial'
  ];

  // Handle category checkbox changes
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Handle path selection
  const handleSelectPath = (path) => {
    setSelectedPath(path);
  };

  // Save settings when the user clicks the button
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