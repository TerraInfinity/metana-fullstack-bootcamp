import React from 'react';
import Modal from './LandingDisclaimerModal';

/**
 * LandingDisclaimer component displays a modal with a disclaimer message.
 * 
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {function} props.onAccept - Callback function for when the user accepts the disclaimer.
 * @param {function} props.onDeny - Callback function for when the user denies the disclaimer.
 * @param {function} props.onClose - Callback function for when the user closes the modal.
 */
const LandingDisclaimer = ({ isOpen, onAccept, onDeny, onClose }) => {
  console.log("LandingDisclaimer isOpen:", isOpen); // Log the open state of the modal

  // Define button configurations for the modal
  const buttons = [
    { text: 'Approve', color: 'bg-green-500', onClick: () => { console.log("Proceed button clicked."); onAccept(); }, id: 'approve-button' },
    { text: 'Proceed with Restrictions', color: 'bg-yellow-500', onClick: () => { console.log("Proceed with Restrictions button clicked."); onDeny(); }, id: 'proceed-restrictions-button' },
    { text: 'Exit', color: 'bg-red-500', onClick: () => { console.log("Exit button clicked."); onClose(); }, id: 'exit-button' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} disclaimerText={
      <>
        <h2 id="disclaimer-heading">Disclaimer</h2>
        <p id="disclaimer-text">
          Disclaimer: Please Read Carefully Before Proceeding
          {/* Disclaimer content explaining the nature of the platform */}
          By accessing this platform, you acknowledge that the content contains mature, controversial, and morally complex themes, including adult-oriented hypnotic material, esoteric spiritual technologies, and potentially suggestive or explicit content (which may include pornographic material). This includes discussions and depictions of sexuality, dissociation, near-death experiences, trauma, and psychological states that some may find triggering, disrespectful, or unsettling. Viewer discretion is strongly advised.
          {/* Additional disclaimer content */}
          This platform is an experimental space dedicated to exploring the raw, authentic human condition through radical transparency, personal growth, and scientific curiosity. The creator offers an unfiltered account of their psychological evolution—from trauma and psychosis to recovery—as a means to elevate awareness, consciousness, and well-being. The content provides a scientifically honest account of human experiences, blending mental health experimentation with topics like dissociation, sexuality, near-death experiences, and how these tie into societal shadows and unconscious projections we both receive from and impose on others. This exploration seeks to illuminate the complex interplay between individual psyches and collective cultural dynamics.
          We emphasize that this content is not intended to cause harm or promote toxic, abusive, or non-consensual behaviors. Consent, mental health, and personal responsibility are paramount. Given the subtle bridge between experimental psychology, spirituality, and ethical principles, we take consent very seriously and prioritize it in all aspects of this platform. We urge users to engage with maturity and self-awareness, recognizing that this is not a substitute for professional medical or psychological advice and is not clinically validated—approach with caution and critical thinking.
          Freedom of expression is a cornerstone here. We assert that society's suppression of these topics, rather than their open exploration, perpetuates misunderstanding and harm. Healing and growth come from acknowledging and examining challenging truths, not silencing them. We respectfully request that any criticisms of the content consider the evolutionary pattern of growth and maturity and approach this sensitive topic through the lens of academia, with curiosity and critical analysis.
          The core essence of this platform is to provide an environment and imaginative psychological system for the purpose of elevating one's awareness, consciousness, and health. Our pure intention is to create a safe space for self-discovery, fostering the light of consciousness and grappling with the elusive nature of truth. If you believe this platform could better promote ethical, consensual, or healthy practices, we welcome constructive feedback. Our aim is to contribute to a more compassionate, aware society. If you're not prepared to engage responsibly, please exit now.
          By proceeding, you confirm:  
        </p>
        <p>You are of legal age in your jurisdiction.</p>
        <p>You consent to viewing this content.</p>
        <p>You assume full responsibility for your experience.</p>
      </>
    }>
      <div className="flex flex-col">
        <ul className="bg-white p-4 rounded-lg shadow-md space-y-2">
          {/* List of warnings regarding the content */}
          <li id="warning-explicit-language" className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            This content may include explicit language or imagery
          </li>
          <li id="warning-viewer-discretion" className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Viewer discretion is advised
          </li>
          <li id="warning-age-restriction" className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            You must be 18+ to view unrestricted content
          </li>
        </ul>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-3">
            {/* Button to exit the disclaimer */}
            <button
              id="exit-disclaimer-button"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => {
                window.location.href = 'https://www.youtube.com/watch?v=oCrhTU9HkVQ';
              }}
              aria-label="Exit disclaimer"
              style={{ fontSize: '1rem' }}
            >
              Exit
            </button>
            {/* Button to continue with restrictions (SFW) */}
            <button
              id="continue-restricted-button"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              onClick={() => {
                localStorage.setItem('restricted', 'true');
                sessionStorage.setItem('disclaimerApproved', 'true');
                window.location.href = '/home';
              }}
              aria-label="Continue with restrictions (SFW)"
              style={{ fontSize: '1rem' }}
            >
              Continue (SFW)
            </button>
            {/* Button to accept the disclaimer (NSFW) */}
            <button
              id="accept-disclaimer-button"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => {
                sessionStorage.setItem('disclaimerApproved', 'true');
                window.location.href = '/home';
              }}
              aria-label="Accept disclaimer (NSFW)"
              style={{ fontSize: '1rem' }}
            >
              Accept (NSFW)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LandingDisclaimer;
