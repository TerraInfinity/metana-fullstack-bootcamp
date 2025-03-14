/**
 * Modal.jsx - Modal component for displaying content in a modal dialog.
 * 
 * @param {boolean} isOpen - Determines if the modal is open.
 * @param {function} onClose - Function to call when the modal should be closed.
 * @param {ReactNode} children - Content to be displayed inside the modal.
 */
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    console.log('Overflow Effect: isOpen =', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      console.log('Overflow Cleanup');
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Close modal on ESC key press (accessibility)
  React.useEffect(() => {
    console.log('Keydown Effect: isOpen =', isOpen);
    if (isOpen) {
      const handleEsc = (event) => {
        if (event.key === 'Escape') {
          console.log('Escape key pressed, calling onClose');
          onClose();
        }
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        console.log('Keydown Cleanup');
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
        className="bg-white p-6 rounded-lg w-11/12 max-w-lg max-h-[80vh] overflow-y-auto relative md:w-3/4"
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