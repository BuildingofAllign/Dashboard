
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { Button } from './button';

interface ZoomablePannableProps {
  children: React.ReactNode;
  className?: string;
  maxZoom?: number;
  minZoom?: number;
  zoomStep?: number;
}

export const ZoomablePannable: React.FC<ZoomablePannableProps> = ({
  children,
  className = '',
  maxZoom = 5,
  minZoom = 0.5,
  zoomStep = 0.25
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + zoomStep, maxZoom));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - zoomStep, minZoom));
  };
  
  // Handle reset
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(prev => Math.min(prev + zoomStep, maxZoom));
    } else {
      setZoom(prev => Math.max(prev - zoomStep, minZoom));
    }
  };
  
  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPanPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPosition({
        x: e.clientX - startPanPosition.x,
        y: e.clientY - startPanPosition.y
      });
    }
  };
  
  // Handle mouse up to stop panning
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  // Add and remove event listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        ref={containerRef}
        className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
          }}
          className="w-full h-full"
        >
          {children}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg shadow-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom In</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom Out</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">Reset</span>
        </Button>
      </div>
      
      <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded shadow text-xs">
        Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};
