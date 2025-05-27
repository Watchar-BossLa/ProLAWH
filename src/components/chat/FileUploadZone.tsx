
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, File, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  onCancel: () => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export function FileUploadZone({
  onFileUpload,
  onCancel,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt', '.zip']
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragActive(false);

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        toast({
          title: "File too large",
          description: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`,
          variant: "destructive"
        });
      } else if (error.code === 'file-invalid-type') {
        toast({
          title: "Invalid file type",
          description: "Please select a supported file format",
          variant: "destructive"
        });
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Upload File</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive || dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <Image className="h-8 w-8 text-muted-foreground" />
            <File className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <div>
            <p className="text-sm font-medium">
              {isDragActive || dragActive 
                ? 'Drop file here' 
                : 'Drag & drop a file or click to browse'
              }
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>Supported formats: Images, PDF, Documents, Text files, Archives</p>
      </div>
    </Card>
  );
}
