
import React from "react";
import { FileImage } from "lucide-react";

export const AddDrawingCard: React.FC = () => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-[320px] bg-gray-50 hover:bg-gray-100 cursor-pointer">
      <div className="text-center p-5">
        <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-full flex items-center justify-center">
          <FileImage className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">Upload tegning</h3>
        <p className="text-sm text-gray-500 mb-3">Klik for at uploade en ny tegning</p>
      </div>
    </div>
  );
};
