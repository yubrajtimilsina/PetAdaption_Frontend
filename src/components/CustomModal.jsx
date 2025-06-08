import React from "react";
import { X } from "lucide-react"; // Ensure lucide-react is installed: npm install lucide-react

// A generic modal component to be used across your application
// Props:
// - children: The content to be rendered inside the modal.
// - onClose: A function to call when the modal needs to be closed (e.g., clicking the 'X' button or overlay).
// - title: The title displayed at the top of the modal (defaults to "Modal").
const CustomModal = ({ children, onClose, title = "Modal" }) => {
  // Prevent clicks inside the modal content from closing the modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Outer div for the modal overlay and positioning
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose} // Allows clicking outside the modal content to close it
    >
      {/* Modal content container */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 animate-slideUp"
        onClick={handleContentClick} // Stop propagation for clicks within the modal content
      >
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal" // Accessibility improvement
          >
            <X size={28} />
          </button>
        </div>
        {/* Modal body where children content will be rendered */}
        <div className="modal-content overflow-y-auto max-h-[80vh]"> {/* Added max-h for scrollable content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
