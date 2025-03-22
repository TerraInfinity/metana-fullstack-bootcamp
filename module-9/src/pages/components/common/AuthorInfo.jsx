/**
 * AuthorInfo.jsx
 * A React component for displaying author information, including their name, 
 * publication date, and profile image.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.name - The name of the author.
 * @param {string} props.date - The date associated with the author's work.
 * @param {string} props.imageUrl - The URL of the author's profile image.
 *
 * @returns {JSX.Element} The rendered author information component.
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