
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, File, Image, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadData {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

interface FileUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  onCancel: () => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  className?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function FileUploadZone({
  onFileUpload,
  onCancel,
  maxFiles = 5,
  maxSize = MAX_FILE_SIZE,
  allowedTypes = ALLOWED_TYPES,
  className
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadData[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('File type not supported');
      } else {
        setError('File upload failed');
      }
      return;
    }

    // Process accepted files
    const newFiles: FileUploadData[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress for each file
    newFiles.forEach(fileData => {
      simulateUpload(fileData);
    });

    // Notify parent component
    onFileUpload(acceptedFiles);
  }, [maxSize, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: allowedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    multiple: maxFiles > 1
  });

  const simulateUpload = async (fileData: FileUploadData) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileData.id ? { ...f, status: 'uploading' as const } : f
    ));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, progress } : f
      ));
    }

    // Mock successful upload
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileData.id 
        ? { 
            ...f, 
            status: 'completed' as const, 
            progress: 100,
            url: URL.createObjectURL(fileData.file)
          } 
        : f
    ));
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-1">
          {isDragActive
            ? "Drop files here..."
            : "Drag & drop files here, or click to select"
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Max {maxFiles} files, up to {formatFileSize(maxSize)} each
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {uploadedFiles.map((fileData) => (
            <div key={fileData.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {getFileIcon(fileData.file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {fileData.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileData.file.size)}
                </p>
                {fileData.status === 'uploading' && (
                  <Progress value={fileData.progress} className="mt-1 h-1" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {fileData.status === 'completed' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {fileData.status === 'error' && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileData.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={() => {
            const completedFiles = uploadedFiles
              .filter(f => f.status === 'completed')
              .map(f => f.file);
            if (completedFiles.length > 0) {
              onFileUpload(completedFiles);
            }
          }}
          disabled={uploadedFiles.filter(f => f.status === 'completed').length === 0}
        >
          Send {uploadedFiles.filter(f => f.status === 'completed').length} File(s)
        </Button>
      </div>
    </div>
  );
}
