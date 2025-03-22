//AdditionalDetails.jsx
import React from 'react';

/**
 * AdditionalDetails component displays user profile details.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.details - The user details object.
 * @param {number} [props.details.age] - The age of the user.
 * @param {string} [props.details.gender] - The gender of the user.
 * @param {string} [props.details.orientation] - The sexual orientation of the user.
 * @param {string} [props.details.pronouns] - The pronouns of the user.
 * @returns {JSX.Element} The rendered component.
 */
const AdditionalDetails = ({ details = {} }) => {
  const { age, gender, orientation, pronouns } = details;

  return (
    <div className="space-y-2">
      {/* Display age with a fallback if not specified */}
      <p>
        <span className="font-bold text-white">Age: </span>
        <span className="text-gray-300">{age || 'Not specified'}</span>
      </p>
      {/* Display gender with a fallback if not specified */}
      <p>
        <span className="font-bold text-white">Gender: </span>
        <span className="text-gray-300">{gender || 'Not specified'}</span>
      </p>
      {/* Display orientation with a fallback if not specified */}
      <p>
        <span className="font-bold text-white">Orientation: </span>
        <span className="text-gray-300">{orientation || 'Not specified'}</span>
      </p>
      {/* Display pronouns with a fallback if not specified */}
      <p>
        <span className="font-bold text-white">Pronouns: </span>
        <span className="text-gray-300">{pronouns || 'Not specified'}</span>
      </p>
    </div>
  );
};

export default AdditionalDetails;