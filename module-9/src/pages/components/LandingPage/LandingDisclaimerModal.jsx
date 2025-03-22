import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';

/**
 * LandingDisclaimerModal component displays a modal with a disclaimer message
 * and options for the user to accept or decline the terms.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {React.node} props.disclaimerText - The text or elements to display as the disclaimer.
 * @param {function} props.onAccept - Function to call when the user accepts the disclaimer.
 * @param {function} props.onDecline - Function to call when the user declines the disclaimer.
 * @param {function} props.onLearnMore - Function to call for more information about the disclaimer.
 */
const LandingDisclaimerModal = ({
  isOpen,
  onClose,
  disclaimerText,
  onAccept,
  onDecline,
  onLearnMore
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col h-full max-h-[80vh]">
        <header className="w-full mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Disclaimer
          </h1>
        </header>

        <div className="flex-grow overflow-y-auto max-h-[50vh]">
          <section className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-sm md:text-base text-gray-700 text-center whitespace-normal break-words">
              {React.Children.map(disclaimerText, (child) => {
                if (typeof child === 'string') {
                  return <span className="whitespace-normal break-words">{child}</span>;
                }
                return React.cloneElement(child, {
                  className: `${child.props.className || ''} whitespace-normal break-words max-w-full`,
                });
              })}
            </div>
          </section>
        </div>

        <ul className="bg-white p-4 rounded-lg shadow-md space-y-2">
          {/* List of warnings regarding the content */}
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            This content may include explicit language or imagery
          </li>
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Viewer discretion is advised
          </li>
          <li className="text-sm md:text-base text-gray-700 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            You must be 18+ to view unrestricted content
          </li>
        </ul>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-3 gap-3">
            {/* Button to exit the disclaimer */}
            <button
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

// PropTypes for type checking
LandingDisclaimerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  disclaimerText: PropTypes.node.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
  onLearnMore: PropTypes.func.isRequired
};

// Default props for the component
LandingDisclaimerModal.defaultProps = {
  disclaimerText: 'Please review the terms and conditions.',
};

export default LandingDisclaimerModal;