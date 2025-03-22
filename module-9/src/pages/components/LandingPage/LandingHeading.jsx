import React from 'react';

/**
 * LandingHeading component renders the main heading for the landing page.
 * It displays a welcoming message with responsive styling.
 *
 * @returns {JSX.Element} The rendered heading element.
 */
const LandingHeading = () => {
  return (
    <h1 className="text-9xl text-yellow-700 max-md:max-w-full max-md:text-4xl">
      Welcome To The Light Ages
    </h1>
  );
};

export default LandingHeading;