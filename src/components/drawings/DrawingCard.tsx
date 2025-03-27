
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
      </div>
    </Card>
  );
};

