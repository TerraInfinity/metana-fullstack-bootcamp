/**
 * AuthorInfo.jsx
 * A component for displaying author information.
 */
import React from 'react';

const AuthorInfo = ({ name, date, imageUrl }) => {
  return (
    <div className="flex gap-3 items-center">
      <img src={imageUrl} alt={name} className="w-8 h-8 rounded-full" />
      <div>{name}</div>
      <div className="text-gray-400">{date}</div>
    </div>
  );
};

export default AuthorInfo;