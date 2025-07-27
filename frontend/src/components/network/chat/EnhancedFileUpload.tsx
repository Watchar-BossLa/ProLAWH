
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, File, Image, FileText, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface EnhancedFileUploadProps {
  onFileUploaded: (fileData: { id: string; url: string; name: string; size: number; type: string }) => void;
  onCancel: () => void;
  maxSize?: number;
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function EnhancedFileUpload({
  onFileUploaded,
  onCancel,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  multiple = true,
  className
}: EnhancedFileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadItem[]>([]);

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

  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload with progress
    return new Promise((resolve, reject) => {
      const fileId = Date.now().toString() + Math.random().toString(36);
      
      setUploadingFiles(prev => [...prev, {
        id: fileId,
        file,
        progress: 0,
        status: 'uploading'
      }]);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Simulate successful upload
          const mockUrl = URL.createObjectURL(file);
          
          setUploadingFiles(prev => 
            prev.map(item => 
              item.id === fileId 
                ? { ...item, progress: 100, status: 'success', url: mockUrl }
                : item
            )
          );

          onFileUploaded({
            id: fileId,
            url: mockUrl,
            name: file.name,
            size: file.size,
            type: file.type
          });

          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(item => item.id !== fileId));
          }, 2000);

          resolve(mockUrl);
        } else {
          setUploadingFiles(prev => 
            prev.map(item => 
              item.id === fileId 
                ? { ...item, progress: Math.min(progress, 99) }
                : item
            )
          );
        }
      }, 200);
    });
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: `${file.name}: ${validationError}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await uploadFile(file);
      toast({
        title: "Upload successful",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await handleFileUpload(file);
    }
  }, [maxSize, acceptedTypes]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
  });

  const removeUploadingFile = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const retryUpload = async (fileId: string) => {
    const fileItem = uploadingFiles.find(f => f.id === fileId);
    if (fileItem) {
      await handleFileUpload(fileItem.file);
    }
  };

  const hasActiveUploads = uploadingFiles.some(f => f.status === 'uploading');

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
                  <Badge variant="secondary" className="text-xs">Images</Badge>
                  <Badge variant="secondary" className="text-xs">PDF</Badge>
                  <Badge variant="secondary" className="text-xs">Text files</Badge>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Maximum file size: {formatFileSize(maxSize)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">File Uploads</h4>
              
              {uploadingFiles.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(item.file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {item.file.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(item.file.size)}
                      </span>
                    </div>
                    
                    {item.status === 'uploading' && (
                      <Progress value={item.progress} className="h-2" />
                    )}
                    
                    {item.status === 'success' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-xs">Upload complete</span>
                      </div>
                    )}
                    
                    {item.status === 'error' && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">Upload failed</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => retryUpload(item.id)}
                          className="h-6 px-2"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadingFile(item.id)}
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

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={hasActiveUploads}>
          {hasActiveUploads ? 'Uploading...' : 'Cancel'}
        </Button>
      </div>
    </div>
  );
}
