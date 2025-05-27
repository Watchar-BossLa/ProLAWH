
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, Image, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type AttachmentType = 'image' | 'file' | 'document';

interface FileUploadButtonProps {
  onFileUploaded: (fileData: {
    id: string;
    type: AttachmentType;
    url: string;
    name: string;
    size: number;
  }) => void;
  disabled?: boolean;
  acceptedTypes?: string[];
  maxSize?: number;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUploadButton({
  onFileUploaded,
  disabled = false,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  maxSize = DEFAULT_MAX_SIZE
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAttachmentType = (file: File): AttachmentType => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf' || file.type.startsWith('application/')) return 'document';
    return 'file';
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a URL for the file (in a real app, you'd upload to a server)
      const url = URL.createObjectURL(file);
      const fileData = {
        id: Date.now().toString() + Math.random().toString(36),
        type: getAttachmentType(file),
        url,
        name: file.name,
        size: file.size
      };

      onFileUploaded(fileData);

      toast({
        title: "File attached",
        description: `${file.name} has been attached to your message.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to attach file. Please try again.",
        variant: "destructive",
      });
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload file"
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={disabled}
        className="shrink-0"
        title="Attach file"
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </>
  );
}
