
import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from './button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploadProps {
  onUploadComplete: (filePath: string) => void;
  bucketName?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  storageFolder?: string;
  buttonText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  bucketName = 'images',
  accept = 'image/*',
  maxSize = 5, // Default 5MB
  className = '',
  storageFolder = '',
  buttonText = 'Upload fil'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    const selectedFile = event.target.files[0];
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`Filen er for stor. Maksimal størrelse er ${maxSize}MB`);
      return;
    }
    
    setFile(selectedFile);
    
    // Create a preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };
  
  const uploadFile = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      setProgress(0);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = storageFolder ? `${storageFolder}/${fileName}` : fileName;
      
      // Upload the file
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      toast.success('Fil uploadet');
      onUploadComplete(publicUrl);
      
      // Reset state
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error: any) {
      toast.error('Upload fejlede', { description: error.message });
    } finally {
      setUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    if (file) {
      uploadFile();
    } else {
      fileInputRef.current?.click();
    }
  };
  
  const cancelUpload = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const getFileIcon = () => {
    if (!file) return null;
    
    if (file.type.startsWith('image/')) {
      return preview ? null : <ImageIcon className="h-6 w-6 text-gray-500" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-blue-500" />;
    }
  };
  
  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      
      {file && (
        <div className="mb-4 relative">
          {preview ? (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md" 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.open(preview, '_blank')}
                >
                  Se stort
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
              {getFileIcon()}
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                {file.name}
              </span>
            </div>
          )}
          
          {!uploading && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 bg-white/80 dark:bg-gray-800/80 rounded-full"
              onClick={cancelUpload}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploader... {progress}%
          </>
        ) : file ? (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload {file.name}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
};
