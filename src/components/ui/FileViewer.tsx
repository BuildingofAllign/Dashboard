
import React from 'react';
import { File, FileText, Image, FileType, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
  fileName: string;
  className?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType, fileName, className = '' }) => {
  // Determine the file icon based on file type
  const getFileIcon = () => {
    const lowerType = fileType.toLowerCase();
    if (lowerType.includes('image')) {
      return <Image className="w-12 h-12 text-blue-500" />;
    } else if (lowerType.includes('pdf')) {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (
      lowerType.includes('word') || 
      lowerType.includes('document') || 
      lowerType.includes('txt')
    ) {
      return <FileText className="w-12 h-12 text-blue-500" />;
    } else {
      return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  // Determine the content based on file type
  const renderContent = () => {
    const lowerType = fileType.toLowerCase();
    try {
      if (lowerType.includes('image')) {
        return (
          <img 
            src={fileUrl} 
            alt={fileName} 
            className="max-h-96 object-contain mx-auto rounded-md" 
          />
        );
      } else if (lowerType.includes('pdf')) {
        return (
          <div className="flex flex-col items-center">
            {getFileIcon()}
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              PDF dokument: {fileName}
            </p>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 hover:underline"
            >
              Åbn PDF
            </a>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col items-center">
            {getFileIcon()}
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {fileName}
            </p>
            <a 
              href={fileUrl} 
              download={fileName}
              className="mt-2 text-blue-500 hover:underline"
            >
              Download fil
            </a>
          </div>
        );
      }
    } catch (error) {
      return (
        <div className="flex flex-col items-center">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="mt-2 text-center text-red-500">
            Kunne ikke indlæse filen
          </p>
        </div>
      );
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default FileViewer;
