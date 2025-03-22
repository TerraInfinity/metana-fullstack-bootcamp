import React from 'react';

/**
 * BioComponent displays a user's biography.
 *
 * @param {Object} props - The component props.
 * @param {string} props.bio - The user's biography text.
 * @returns {JSX.Element} The rendered component.
 */
function BioComponent({ bio }) {
  return (
    <p className="text-gray-300">
      {bio ? bio : 'No bio yet.'}
    </p>
  );
}

export default BioComponent; 