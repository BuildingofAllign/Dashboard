
import React from "react";

export const AddProjectCard: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-[320px] bg-gray-50 hover:bg-gray-100 cursor-pointer">
      <div className="text-center p-5">
        <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">Opret nyt projekt</h3>
        <p className="text-sm text-gray-500 mb-3">Klik for at oprette et nyt byggeprojekt</p>
      </div>
    </div>
  );
};
