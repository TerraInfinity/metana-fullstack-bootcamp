// AchievementsGrid.jsx
import React from 'react';

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