
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Upload, File, Image } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export function FileUpload({ 
  onFileUpload, 
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', '.doc', '.docx']
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.size <= maxSize) {
        onFileUpload(file);
      }
    });
  }, [onFileUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
  });

  return (
    <Card
      {...getRootProps()}
      className={`p-6 border-dashed cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-2 text-center">
        {isDragActive ? (
          <>
            <Upload className="h-8 w-8 text-primary" />
            <p className="text-sm text-primary">Drop files here...</p>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <File className="h-6 w-6 text-muted-foreground" />
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Drop files here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Max size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
