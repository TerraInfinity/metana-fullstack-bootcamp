import React from 'react';

function BioComponent({ bio }) {
  return (
    <p className="text-gray-300">
      {bio ? bio : 'No bio yet.'}
    </p>
  );
}

export default BioComponent; 