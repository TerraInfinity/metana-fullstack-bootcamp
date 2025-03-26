// AchievementsGrid.jsx
import React from 'react';

/**
 * AchievementsGrid component
 * 
 * This component displays a grid of user achievements, including icons and titles.
 * If no achievements are available, it shows a message indicating that.
 * 
 * @component
 * @param {Object[]} achievements - An array of achievement objects to display.
 * @param {string} achievements[].id - A unique identifier for each achievement.
 * @param {string} achievements[].iconUrl - The URL of the achievement's icon image.
 * @param {string} achievements[].name - The name of the achievement.
 * @returns {JSX.Element} A grid layout of achievement icons and titles, or a message if none are available.
 */
const AchievementsGrid = ({ achievements }) => {
  // Check if there are no achievements to display
  if (!achievements || achievements.length === 0) {
    return <div className="text-white">No achievements yet.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4" id="achievements-grid">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="flex justify-center" id={`achievement-${achievement.id}`}>
          <img
            src={achievement.iconUrl}
            alt={achievement.name}
            className="w-16 h-16 hover:scale-105 transition"
            title={achievement.name} // Tooltip displayed on hover
            id={`achievement-icon-${achievement.id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default AchievementsGrid;