/**
 * AdBanner.jsx
 * A functional component that renders an advertisement banner.
 * 
 * This component is designed to display a banner ad with a recommended size of 728x90 pixels.
 * It is styled with padding, margin, and background color for better visibility.
 * 
 * @returns {JSX.Element} The rendered advertisement banner.
 */
import React from 'react';

const AdBanner = () => {
  return (
    <div id="ad-banner" className="p-8 mx-20 my-10 text-center text-white bg-slate-800">
      You can place ads 728x90
    </div>
  );
};

export default AdBanner;