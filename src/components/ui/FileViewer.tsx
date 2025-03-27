
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  File, 
  FileText, 
  Image as ImageIcon, 
  FileSpreadsheet, 
  FilePdf, 
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileViewerProps {
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
    thumbnail?: string;
    dateAdded?: string;
    metadata?: Record<string, any>;
  }>;
  initialIndex?: number;
  onDownload?: (file: any) => void;
  className?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  allowFullscreen?: boolean;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  files,
  initialIndex = 0,
  onDownload,
  className,
  showThumbnails = true,
  showControls = true,
  allowFullscreen = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const currentFile = files[currentIndex];
  
  const isImage = currentFile?.type?.startsWith('image/');
  const isPdf = currentFile?.type === 'application/pdf';
  const isVideo = currentFile?.type?.startsWith('video/');
  const isAudio = currentFile?.type?.startsWith('audio/');
  const isSpreadsheet = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ].includes(currentFile?.type || '');
  
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (type === 'application/pdf') return <FilePdf className="h-6 w-6" />;
    if (type.includes('spreadsheet') || type === 'text/csv') return <FileSpreadsheet className="h-6 w-6" />;
    if (type.includes('text/') || type.includes('document')) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  
  const handleNext = () => {
    setCurrentIndex((current) => (current === files.length - 1 ? 0 : current + 1));
    resetView();
  };
  
  const handlePrevious = () => {
    setCurrentIndex((current) => (current === 0 ? files.length - 1 : current - 1));
    resetView();
  };
  
  const handleZoomIn = () => {
    setZoomLevel((current) => Math.min(current + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel((current) => Math.max(current - 0.25, 0.5));
  };
  
  const handleRotate = () => {
    setRotation((current) => (current + 90) % 360);
  };
  
  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  
  const toggleFullscreen = () => {
    if (allowFullscreen) {
      setIsFullscreen(!isFullscreen);
    }
  };
  
  const renderFilePreview = () => {
    if (!currentFile) return null;
    
    if (isImage) {
      return (
        <div 
          className="flex items-center justify-center overflow-hidden"
          style={{ 
            maxHeight: isFullscreen ? '80vh' : '400px',
          }}
        >
          <img
            src={currentFile.url}
            alt={currentFile.name}
            className="max-h-full object-contain transition-transform"
            style={{ 
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              maxWidth: '100%',
            }}
          />
        </div>
      );
    }
    
    if (isPdf) {
      return (
        <div 
          className="w-full"
          style={{ 
            height: isFullscreen ? '80vh' : '400px'
          }}
        >
          <iframe
            src={`${currentFile.url}#view=FitH`}
            title={currentFile.name}
            className="h-full w-full border-0"
          />
        </div>
      );
    }
    
    if (isVideo) {
      return (
        <div 
          className="w-full"
          style={{ 
            height: isFullscreen ? '80vh' : '400px'
          }}
        >
          <video
            src={currentFile.url}
            controls
            className="h-full w-full"
          />
        </div>
      );
    }
    
    if (isAudio) {
      return (
        <div className="flex items-center justify-center p-6">
          <audio src={currentFile.url} controls className="w-full" />
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          {getFileIcon(currentFile.type)}
        </div>
        <h3 className="text-lg font-medium">{currentFile.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This file type cannot be previewed. Please download to view.
        </p>
        <Button
          className="mt-4"
          onClick={() => onDownload && onDownload(currentFile)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    );
  };
  
  const renderThumbnails = () => {
    if (!showThumbnails || files.length <= 1) return null;
    
    return (
      <div className="mt-4 flex items-center justify-center space-x-2 overflow-x-auto">
        {files.map((file, index) => (
          <button
            key={file.id}
            className={cn(
              "relative h-16 w-16 overflow-hidden rounded border transition-all",
              index === currentIndex 
                ? "border-primary shadow-sm" 
                : "border-muted hover:border-muted-foreground"
            )}
            onClick={() => {
              setCurrentIndex(index);
              resetView();
            }}
          >
            {file.type.startsWith('image/') ? (
              <img
                src={file.thumbnail || file.url}
                alt={file.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {getFileIcon(file.type)}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  };
  
  if (!files.length || !currentFile) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-muted p-3">
            <File className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No files to display</h3>
        </CardContent>
      </Card>
    );
  }
  
  const fileViewer = (
    <div className={cn(
      "flex flex-col",
      isFullscreen ? "h-full" : "",
      className
    )}>
      <div className={cn(
        "relative flex-1 overflow-hidden",
        isFullscreen ? "h-full" : ""
      )}>
        {renderFilePreview()}
        
        {files.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </>
        )}
      </div>
      
      {showControls && (isImage || isPdf) && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          {isImage && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
                <span className="sr-only">Zoom Out</span>
              </Button>
              <span className="text-sm">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="h-4 w-4" />
                <span className="sr-only">Zoom In</span>
              </Button>
            </>
          )}
          
          {isImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Rotate</span>
            </Button>
          )}
          
          {allowFullscreen && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Fullscreen</span>
            </Button>
          )}
          
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(currentFile)}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
        </div>
      )}
      
      {renderThumbnails()}
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm">
          <span className="font-medium">{currentIndex + 1}</span> 
          <span className="text-muted-foreground"> / {files.length}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatFileSize(currentFile.size)}
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {currentFile.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {fileViewer}
        </CardContent>
        {currentFile.dateAdded && (
          <CardFooter className="text-xs text-muted-foreground">
            Added {new Date(currentFile.dateAdded).toLocaleDateString()}
          </CardFooter>
        )}
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{currentFile.name}</DialogTitle>
          </DialogHeader>
          
          <div className="relative h-[70vh] overflow-hidden">
            {renderFilePreview()}
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {onDownload && (
                <Button onClick={() => onDownload(currentFile)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
