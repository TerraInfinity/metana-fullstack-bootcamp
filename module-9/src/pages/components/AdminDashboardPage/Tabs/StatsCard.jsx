// StatsCard.jsx
import React from 'react';

const StatsCard = ({ stats = {} }) => {
  const { posts = 0, friends = 0, badges = 0 } = stats;

  return (
    <div className="grid grid-cols-3 gap-4 bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <div className="text-center">
        <span className="font-bold">Posts: </span>
        <span>{posts}</span>
      </div>
      <div className="text-center">
        <span className="font-bold">Friends: </span>
        <span>{friends}</span>
      </div>
      <div className="text-center">
        <span className="font-bold">Badges: </span>
        <span>{badges}</span>
      </div>
    </div>
  );
};

export default StatsCard;