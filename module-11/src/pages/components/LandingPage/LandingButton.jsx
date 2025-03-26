import React from 'react';

/**
 * LandingButton component renders a button that triggers an action when clicked.
 *
 * @param {Object} props - The props for the component.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @returns {JSX.Element} The rendered button element.
 */
const LandingButton = ({ onClick }) => {
  return (
    <button 
      id="landing-button"
      onClick={onClick}
      className="px-16 py-5 mt-24 max-w-full text-black bg-amber-400 rounded-[36px] w-[490px] max-md:px-5 max-md:mt-10 max-md:text-lg text-xl"
    >
      Enter the Light Ages
    </button>
  );
};

export default LandingButton;