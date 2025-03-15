import React from 'react';

const LandingButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-16 py-5 mt-24 max-w-full text-black bg-amber-400 rounded-[36px] w-[490px] max-md:px-5 max-md:mt-10 max-md:text-lg text-xl"
    >
      Enter the Light Ages
    </button>
  );
};

export default LandingButton;