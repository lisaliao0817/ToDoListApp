
import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, placeholder, initialValue = '', onSubmit }) => {
  const [inputValue, setInputValue] = React.useState(initialValue);

  useEffect(() => {
    if (!isOpen) setInputValue('');  // Reset the input when modal is closed
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // This prevents the page from refreshing on form submission
    
    if (inputValue.trim() !== '') {
      onSubmit(inputValue);
      onClose();
    } else {
      alert('Input cannot be blank!');
    }
  };

  return (
    <div className="fixed z-10 inset-0 w-screen overflow-y-auto">
      <div className="fixed inset-0 bg-gray-600 opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white pt-6 px-8 pb-5 rounded-lg shadow-2xl z-20 w-96 h-65"> {/* Fixed width and height */}
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-5 text-center">{title}</h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="p-2 border rounded w-full mb-8"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
            />
            <div className="flex justify-stretch space-x-3"> {/* Adjusted for button widths */}
              <button 
                type="button" 
                className="px-4 py-2 border rounded flex-grow hover:bg-gray-200"  // Occupies almost half width
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-grow"  // Modernized color & hover effect
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
