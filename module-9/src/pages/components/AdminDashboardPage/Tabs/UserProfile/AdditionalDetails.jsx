//AdditionalDetails.jsx
import React from 'react';

const AdditionalDetails = ({ details = {} }) => {
  const { age, gender, orientation, pronouns } = details;

  return (
    <div className="space-y-2">
      <p>
        <span className="font-bold text-white">Age: </span>
        <span className="text-gray-300">{age || 'Not specified'}</span>
      </p>
      <p>
        <span className="font-bold text-white">Gender: </span>
        <span className="text-gray-300">{gender || 'Not specified'}</span>
      </p>
      <p>
        <span className="font-bold text-white">Orientation: </span>
        <span className="text-gray-300">{orientation || 'Not specified'}</span>
      </p>
      <p>
        <span className="font-bold text-white">Pronouns: </span>
        <span className="text-gray-300">{pronouns || 'Not specified'}</span>
      </p>
    </div>
  );
};

export default AdditionalDetails;