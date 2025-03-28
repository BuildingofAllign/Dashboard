import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ZoomIn, ZoomOut, MousePointer, Pencil, Type, 
  Square, Circle, Move, Undo, Redo, Save, Download,
  Trash, Image, Check, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Drawing } from "./DrawingCard";

interface AnnotatableDrawingViewerProps {
  imageUrl?: string;
  className?: string;
  onSave?: (annotations: any) => void;
  drawing?: Drawing;
  onClose?: () => void;
}

type AnnotationTool = 'pointer' | 'pencil' | 'text' | 'rectangle' | 'circle';
type Annotation = {
  id: string;
  tool: AnnotationTool;
  author: string;
  timestamp: Date;
  content: string;
  position: { x: number; y: number };
  color: string;
};

export const AnnotatableDrawingViewer: React.FC<AnnotatableDrawingViewerProps> = ({
  imageUrl,
  className,
  onSave,
  drawing,
  onClose
}) => {
  const imageToUse = imageUrl || (drawing ? drawing.thumbnail : '');
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState<AnnotationTool>('pointer');
  const [lineWidth, setLineWidth] = useState(2);
  const [lineColor, setLineColor] = useState('#ff0000');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingTextAnnotation, setIsAddingTextAnnotation] = useState(false);
  const [tempAnnotation, setTempAnnotation] = useState<Partial<Annotation> | null>(null);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 30));
  };
  
  const handleAddAnnotation = (event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'pointer') return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    if (selectedTool === 'text') {
      setIsAddingTextAnnotation(true);
      setTempAnnotation({
        tool: 'text',
        position: { x, y },
        color: lineColor
      });
    } else {
      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        tool: selectedTool,
        author: 'Current User',
        timestamp: new Date(),
        content: '',
        position: { x, y },
        color: lineColor
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
    }
  };
  
  const handleSaveTextAnnotation = (text: string) => {
    if (!tempAnnotation) return;
    
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      tool: 'text',
      author: 'Current User',
      timestamp: new Date(),
      content: text,
      position: tempAnnotation.position as { x: number; y: number },
      color: tempAnnotation.color as string
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    setIsAddingTextAnnotation(false);
    setTempAnnotation(null);
  };
  
  const handleCancelTextAnnotation = () => {
    setIsAddingTextAnnotation(false);
    setTempAnnotation(null);
  };
  
  const handleSaveDrawing = () => {
    if (onSave) {
      onSave(annotations);
    }
  };
  
  const handleClearAnnotations = () => {
    if (confirm('Er du sikker på at du vil fjerne alle annotationer?')) {
      setAnnotations([]);
    }
  };

  return (
    <div className={cn("flex flex-col h-full border rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-background/80">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedTool('pointer')}
                  className={cn(selectedTool === 'pointer' && "bg-muted")}
                >
                  <MousePointer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Markør</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedTool('pencil')}
                  className={cn(selectedTool === 'pencil' && "bg-muted")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tegn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedTool('text')}
                  className={cn(selectedTool === 'text' && "bg-muted")}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tilføj tekst</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedTool('rectangle')}
                  className={cn(selectedTool === 'rectangle' && "bg-muted")}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Rektangel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedTool('circle')}
                  className={cn(selectedTool === 'circle' && "bg-muted")}
                >
                  <Circle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cirkel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="relative"
              >
                <div 
                  className="absolute bottom-1 right-1 h-2 w-2 rounded-full" 
                  style={{ backgroundColor: lineColor }}
                />
                <Pencil className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Streg indstillinger</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', 
                    '#000000', '#ffffff', '#ff8800', '#88ff00', '#0088ff', '#8800ff'].map(color => (
                    <div 
                      key={color}
                      className={cn(
                        "h-6 w-6 rounded-full cursor-pointer border",
                        color === '#ffffff' && "border-gray-300",
                        lineColor === color && "ring-2 ring-primary ring-offset-2"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setLineColor(color)}
                    />
                  ))}
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Streg tykkelse</label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[lineWidth]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setLineWidth(value[0])}
                    />
                    <span className="text-sm w-6 text-center">{lineWidth}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="h-6 w-px bg-border mx-1" />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleZoomIn}
                >
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
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom ud</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-sm">{zoom}%</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSaveDrawing}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gem annotationer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleClearAnnotations}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fjern annotationer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download tegning</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div 
        className="relative flex-1 overflow-auto"
        style={{ cursor: selectedTool === 'pointer' ? 'default' : 'crosshair' }}
        onClick={handleAddAnnotation}
      >
        <div 
          className="relative"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          <img 
            src={imageToUse} 
            alt={drawing?.title || "Drawing"} 
            className="max-w-full min-w-[800px]"
          />
          
          {annotations.map(annotation => (
            <div 
              key={annotation.id}
              className="absolute"
              style={{ 
                left: `${annotation.position.x}%`, 
                top: `${annotation.position.y}%`,
              }}
            >
              {annotation.tool === 'text' && (
                <div 
                  className="bg-white/80 px-2 py-1 rounded text-sm border shadow-sm whitespace-nowrap"
                  style={{ color: annotation.color, transform: 'translate(-50%, -50%)' }}
                >
                  {annotation.content || 'Annotation'}
                </div>
              )}
              
              {annotation.tool === 'circle' && (
                <div 
                  className="rounded-full border-2 h-16 w-16"
                  style={{ 
                    borderColor: annotation.color,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
              
              {annotation.tool === 'rectangle' && (
                <div 
                  className="border-2 h-16 w-24"
                  style={{ 
                    borderColor: annotation.color,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
              
              {annotation.tool === 'pencil' && (
                <div 
                  className="h-2 w-2 rounded-full"
                  style={{ 
                    backgroundColor: annotation.color,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </div>
          ))}
          
          {isAddingTextAnnotation && tempAnnotation && (
            <div 
              className="absolute"
              style={{ 
                left: `${tempAnnotation.position?.x}%`, 
                top: `${tempAnnotation.position?.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-white/90 p-2 rounded border shadow-md">
                <Input 
                  autoFocus
                  placeholder="Indtast annotation..."
                  className="mb-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTextAnnotation((e.target as HTMLInputElement).value);
                    } else if (e.key === 'Escape') {
                      handleCancelTextAnnotation();
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 px-2"
                    onClick={handleCancelTextAnnotation}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Annuller
                  </Button>
                  <Button 
                    size="sm"
                    className="h-7 px-2"
                    onClick={(e) => {
                      const input = e.currentTarget.previousSibling?.previousSibling as HTMLInputElement;
                      handleSaveTextAnnotation(input.value);
                    }}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Gem
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
