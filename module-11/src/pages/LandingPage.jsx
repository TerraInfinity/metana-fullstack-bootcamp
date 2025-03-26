/**
 * LandingPage.jsx
 * The landing page component.
 * This component serves as the entry point for users, providing navigation to the main application.
 * It includes buttons and disclaimers for user interaction.
 * 
 * @component
 * @returns {JSX.Element} The rendered landing page component.
 * 
 * @state {boolean} isDisclaimerOpen - Indicates whether the disclaimer modal is open or closed.
 * 
 * @method handleAccept - Handles the acceptance of the disclaimer and navigates to the homepage.
 * @method handleDeny - Handles the denial of the disclaimer, sets a restriction in local storage, and navigates to the homepage.
 */
import React from "react";
import { useNavigate } from "react-router-dom";

import Button from './components/LandingPage/LandingButton';
import Heading from './components/LandingPage/LandingHeading';
import Paragraph from './components/LandingPage/LandingParagraph';
import LandingDisclaimer from './components/LandingPage/LandingDisclaimer';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isDisclaimerOpen, setDisclaimerOpen] = React.useState(false);

  const handleAccept = () => {
    console.log("Disclaimer accepted. Navigating to homepage...");
    // Navigate to the homepage after accepting the disclaimer
    navigate('/home');
  };

  const handleDeny = () => {
    console.log("Disclaimer denied. Setting restriction in local storage...");
    // Save restriction status in local storage
    localStorage.setItem('restricted', 'true');
    // Navigate to the homepage without restrictions
    navigate('/home');
  };

  return (
    <div className="flex overflow-hidden flex-col justify-center items-center px-20 py-60 text-4xl text-center bg-stone-900 max-md:px-5 max-md:py-24">
      <div className="flex flex-col items-center max-w-full w-[941px]">
        <Heading />
        <Paragraph />
        <Button
          id="landing-page-button"
          onClick={() => {
            console.log("Button clicked. Checking disclaimer approval...");
            if (sessionStorage.getItem('disclaimerApproved') === 'true') {
              console.log("Disclaimer approved. Navigating to homepage...");
              navigate('/home');
            } else {
              console.log("Disclaimer not approved. Opening disclaimer modal...");
              setDisclaimerOpen(true);
            }
          }}
        />
        <LandingDisclaimer 
          isOpen={isDisclaimerOpen} 
          onAccept={handleAccept} 
          onDeny={handleDeny} 
          onClose={() => {
            console.log("Closing disclaimer modal...");
            setDisclaimerOpen(false);
          }} 
        />
      </div>
    </div>
  );
};
