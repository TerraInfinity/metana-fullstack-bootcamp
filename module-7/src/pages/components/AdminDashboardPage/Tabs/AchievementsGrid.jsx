// AchievementsGrid.jsx
import React from 'react';

/**
 * AchievementsGrid component
 * 
 * This component displays a grid of user achievements, including icons and titles.
 * It shows a message if no achievements are available.
 * 
 * @description Displays a grid of user achievements with icons and titles.
 * @param {Array} achievements - The list of achievements to display.
 * @param {Object} achievements[].id - Unique identifier for the achievement.
 * @param {string} achievements[].iconUrl - URL of the achievement icon.
 * @param {string} achievements[].name - Name of the achievement.
 * @returns {JSX.Element} The rendered achievements grid component.
 */
const AchievementsGrid = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return <div className="text-white">No achievements yet.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex justify-center">
          <img
            src={achievement.iconUrl}
            alt={achievement.name}
            className="w-16 h-16 hover:scale-105 transition"
            title={achievement.name} // Tooltip on hover
          />
        </div>
      ))}
    </div>
  );
};

export default AchievementsGrid;