import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#507b00]"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner; 