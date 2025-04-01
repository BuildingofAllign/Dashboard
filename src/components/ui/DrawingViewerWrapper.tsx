
import React, { useState } from 'react';
import { FileText, X, Download, ZoomIn, ZoomOut, Maximize, Annotation, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Drawing } from '@/components/drawings/DrawingCard';
import { NoData } from './NoData';

interface AnnotationMarker {
  id: number | string;
  position: string;
  color: string;
}

interface DrawingViewerWrapperProps {
  drawing: Drawing;
  onClose?: () => void;
  className?: string;
}

export const DrawingViewerWrapper: React.FC<DrawingViewerWrapperProps> = ({ 
  drawing, 
  onClose,
  className 
}) => {
  const [zoom, setZoom] = useState(100);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // The annotations would typically come from the database
  // For now we'll simulate some annotations based on the drawing's hasAnnotations property
  const annotations: AnnotationMarker[] = drawing.hasAnnotations 
    ? [
        { id: 1, position: "top-1/4 left-1/4", color: "bg-red-500" },
        { id: 2, position: "bottom-1/3 right-1/3", color: "bg-blue-500" },
        { id: 3, position: "top-1/2 right-1/4", color: "bg-green-500" }
      ] 
    : [];

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleToggleAnnotations = () => {
    setShowAnnotations(!showAnnotations);
  };

  if (!drawing) {
    return (
      <NoData 
        title="Ingen tegning fundet"
        description="Den valgte tegning kunne ikke findes"
        icon="file"
      />
    );
  }

  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">{drawing.title}</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500 space-x-3">
            <span>{drawing.project}</span>
            <span>•</span>
            <span>{drawing.version}</span>
            <span>•</span>
            <span>{drawing.tradeType}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={drawing.hasAnnotations ? "destructive" : "success"}>
            {drawing.hasAnnotations ? `${annotations.length} afvigelser` : "Ingen afvigelser"}
          </Badge>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Toolbar */}
      <div className="flex items-center px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom ind</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom ud</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-sm">{zoom}%</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleResetZoom}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nulstil zoom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          {drawing.hasAnnotations && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showAnnotations ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={handleToggleAnnotations}
                  >
                    <Annotation className="h-4 w-4 mr-1" />
                    <span>Vis afvigelser</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showAnnotations ? "Skjul afvigelser" : "Vis afvigelser"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  <span>Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download tegning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Drawing Viewer */}
      <div className="flex-1 overflow-auto relative bg-gray-100 p-4">
        <div 
          className="relative bg-white shadow-md mx-auto overflow-hidden" 
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-in-out',
            height: '90vh',
            width: '90%',
            maxWidth: '1200px'
          }}
        >
          <img 
            src={drawing.thumbnail} 
            alt={drawing.title} 
            className="w-full h-full object-contain"
          />
          
          {showAnnotations && drawing.hasAnnotations && annotations.map((annotation) => (
            <div 
              key={annotation.id}
              className={`absolute ${annotation.position} transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`w-8 h-8 rounded-full ${annotation.color} border-2 border-white flex items-center justify-center text-white font-bold shadow-lg transition-transform hover:scale-110`}
                    >
                      {annotation.id}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="p-1">
                      <p className="font-medium">Afvigelse #{annotation.id}</p>
                      <p className="text-xs mt-1">Klik for at se detaljer</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>
      
      {/* Comments or additional information could go here */}
      {drawing.hasAnnotations && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="font-medium">Kommentarer</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Der er {annotations.length} uløste afvigelser på denne tegning. Klik på markeringerne for at se detaljer.
          </p>
        </div>
      )}
    </div>
  );
};

// Export FileText icon for use in other components
export { FileText };
