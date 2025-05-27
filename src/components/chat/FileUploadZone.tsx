
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, File, Image, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FileUploadZoneProps {
  onFileUpload: (file: File) => Promise<void>;
  onCancel: () => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  id: string;
}

const ACCEPTED_FILE_TYPES = {
  'image/*': 'Images',
  'application/pdf': 'PDF',
  'text/*': 'Text files',
  'application/msword': 'Word documents',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word documents',
};

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUploadZone({
  onFileUpload,
  onCancel,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES),
  multiple = false,
  className
}: FileUploadZoneProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    const isAcceptedType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAcceptedType) {
      return 'File type not supported';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const fileId = Date.now().toString() + Math.random().toString(36);
    const uploadingFile: UploadingFile = {
      file,
      progress: 0,
      status: 'uploading',
      id: fileId
    };

    setUploadingFiles(prev => [...prev, uploadingFile]);

    try {
      // Simulate upload progress
      const updateProgress = (progress: number) => {
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        );
      };

      // Simulate gradual progress
      for (let i = 0; i <= 90; i += 10) {
        updateProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onFileUpload(file);

      setUploadingFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'success' } : f)
      );

      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });

      // Remove from list after success
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
      }, 2000);

    } catch (error) {
      setUploadingFiles(prev => 
        prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f)
      );

      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validationError}`,
          variant: "destructive",
        });
        continue;
      }

      await handleFileUpload(file);
    }
  }, [maxSize, acceptedTypes, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
  });

  const removeUploadingFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive && !isDragReject && "border-primary bg-primary/5",
              isDragReject && "border-destructive bg-destructive/5",
              !isDragActive && "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4">
              <Upload className={cn(
                "h-10 w-10",
                isDragActive && !isDragReject && "text-primary",
                isDragReject && "text-destructive",
                !isDragActive && "text-muted-foreground"
              )} />
              
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive && !isDragReject && "Drop files here"}
                  {isDragReject && "Some files are not supported"}
                  {!isDragActive && "Drag & drop files here"}
                </p>
                
                <p className="text-sm text-muted-foreground">
                  or click to browse files
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(ACCEPTED_FILE_TYPES).map(([type, label]) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Maximum file size: {formatFileSize(maxSize)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploading Files List */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Uploading Files</h4>
              
              {uploadingFiles.map((uploadingFile) => (
                <div key={uploadingFile.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadingFile.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(uploadingFile.file.size)}
                      </span>
                    </div>
                    
                    {uploadingFile.status === 'uploading' && (
                      <Progress value={uploadingFile.progress} className="h-2" />
                    )}
                    
                    {uploadingFile.status === 'success' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-xs">Upload complete</span>
                      </div>
                    )}
                    
                    {uploadingFile.status === 'error' && (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs">Upload failed</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadingFile(uploadingFile.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
