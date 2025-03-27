
import React from "react";
import { MoreVertical, Info, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AnnotationMarker {
  id: number;
  position: string;
  color: string;
}

interface DrawingCardProps {
  title: string;
  project: string;
  version: string;
  imageSrc: string;
  deviations: number;
  additionalTasks: number;
  updatedDaysAgo: number;
  annotationMarkers: AnnotationMarker[];
}

export const DrawingCard: React.FC<DrawingCardProps> = ({
  title,
  project,
  version,
  imageSrc,
  deviations,
  additionalTasks,
  updatedDaysAgo,
  annotationMarkers,
}) => {
  const getUpdatedText = () => {
    if (updatedDaysAgo === 1) return "Opdateret for 1 dag siden";
    if (updatedDaysAgo < 7) return `Opdateret for ${updatedDaysAgo} dage siden`;
    if (updatedDaysAgo === 7) return "Opdateret for 1 uge siden";
    return `Opdateret for ${Math.floor(updatedDaysAgo / 7)} uger siden`;
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {version}
          </span>
        </div>
        
        {annotationMarkers.map((marker) => (
          <div key={marker.id} className={`absolute ${marker.position}`}>
            <div className={`w-6 h-6 rounded-full ${marker.color} border-2 border-white text-white flex items-center justify-center text-xs font-bold`}>
              {marker.id}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{project}</p>
          </div>
          <div className="flex">
            <button className="text-gray-500 hover:text-indigo-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          {deviations} afvigelser, {additionalTasks} tillægsopgave
          {additionalTasks !== 1 ? "r" : ""}
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {getUpdatedText()}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-red-500 mr-2">
              <path fill="currentColor" d="M19.7,11h-1.5v-1c0-0.6-0.4-1-1-1h-7.5c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h7.5c0.6,0,1-0.4,1-1v-1h1.5c0.6,0,1-0.4,1-1v-1C20.7,11.4,20.3,11,19.7,11z" />
              <path fill="currentColor" d="M4.3,13v-2c0-0.6,0.4-1,1-1h1.5v4H5.3C4.7,14,4.3,13.6,4.3,13z" />
            </svg>
            <span className="text-xs font-medium">Meet</span>
          </button>
          
          <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-600 mr-2">
              <path fill="currentColor" d="M19.2,6.4C19.2,5.1,18.1,4,16.8,4h-4c-1.3,0-2.4,1.1-2.4,2.4v3.2c0,1.3,1.1,2.4,2.4,2.4h4c1.3,0,2.4-1.1,2.4-2.4V6.4z" />
              <path fill="currentColor" d="M12,11.8V20c0,0,0,0-0.1,0c-2.3-0.9-4.3-2.4-5.9-4.4V9.4C7,9.2,8.2,9,9.4,9h0.3C9.5,10,10.7,11.5,12,11.8z" />
            </svg>
            <span className="text-xs font-medium">Teams</span>
          </button>
          
          <button className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="text-blue-500 mr-2">
              <path fill="currentColor" d="M16.6,9.4L16.6,9.4L16.6,9.4c0.2-0.1,0.4-0.1,0.6-0.1c0.7,0,1.3,0.6,1.3,1.3v4.4c0,0.7-0.6,1.3-1.3,1.3c-0.2,0-0.4,0-0.6-0.1l0,0l0,0L14,15V9L16.6,9.4z" />
              <path fill="currentColor" d="M12,8H6.7C5.7,8,5,8.7,5,9.7v4.7c0,0.9,0.7,1.7,1.7,1.7H12c0.9,0,1.7-0.7,1.7-1.7V9.7C13.7,8.7,12.9,8,12,8z" />
            </svg>
            <span className="text-xs font-medium">Zoom</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
