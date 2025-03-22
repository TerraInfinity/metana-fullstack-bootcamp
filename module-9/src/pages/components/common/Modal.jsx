/**
 * Modal.jsx - A reusable modal component for displaying content in a dialog overlay.
 * 
 * @param {boolean} isOpen - Indicates whether the modal is currently open (true) or closed (false).
 * @param {function} onClose - Callback function to be invoked when the modal is requested to close, typically triggered by user actions.
 * @param {ReactNode} children - The content to be rendered inside the modal, which can include any valid React elements or components.
 */
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  // Prevent background scrolling when the modal is open by modifying the body's overflow style
  React.useEffect(() => {
    console.log('Overflow Effect: isOpen =', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      console.log('Overflow Cleanup: Resetting body overflow to auto');
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close modal on ESC key press for accessibility
  React.useEffect(() => {
    console.log('Keydown Effect: isOpen =', isOpen);
    if (isOpen) {
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          console.log('Escape key pressed, invoking onClose callback');
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        console.log('Keydown Cleanup: Removing ESC key listener');
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  console.log('Rendering Modal: isOpen =', isOpen);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ${isOpen ? '' : 'hidden'}`}
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;