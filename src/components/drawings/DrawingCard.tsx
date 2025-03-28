
import React from "react";
import { MoreVertical, Info, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AnnotationMarker {
  id: number;
  position: string;
  color: string;
}

export interface Drawing {
  id: string;
  title: string;
  project: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  thumbnail: string;
  tradeType: string;
  status: string;
  hasAnnotations: boolean;
}

export interface DrawingCardProps {
  drawing: Drawing;
  onView?: () => void;
}

export const DrawingCard: React.FC<DrawingCardProps> = ({
  drawing,
  onView
}) => {
  // Generate some random annotation markers for demo
  const annotationMarkers: AnnotationMarker[] = drawing.hasAnnotations 
    ? [
        { id: 1, position: "top-1/4 left-1/4", color: "bg-red-500" },
        { id: 2, position: "bottom-1/3 right-1/3", color: "bg-blue-500" },
        { id: 3, position: "top-1/2 right-1/4", color: "bg-green-500" }
      ]
    : [];

  const getUpdatedText = () => {
    const days = Math.floor(Math.random() * 14) + 1; // Random number of days for demo
    if (days === 1) return "Opdateret for 1 dag siden";
    if (days < 7) return `Opdateret for ${days} dage siden`;
    if (days === 7) return "Opdateret for 1 uge siden";
    return `Opdateret for ${Math.floor(days / 7)} uger siden`;
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
      <div className="relative aspect-[4/3] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={drawing.thumbnail} alt={drawing.title} className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {drawing.version}
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
            <h3 className="text-lg font-semibold text-gray-800">{drawing.title}</h3>
            <p className="text-sm text-gray-600">{drawing.project}</p>
          </div>
          <div className="flex">
            <button className="text-gray-500 hover:text-indigo-600" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Info className="h-4 w-4 mr-1" />
          {drawing.hasAnnotations ? "3 afvigelser, 1 tillægsopgave" : "Ingen afvigelser"}
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          {getUpdatedText()}
        </div>
      </div>
    </Card>
  );
};
