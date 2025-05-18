
import React, { useState, useRef, ChangeEvent } from 'react';
import { Paperclip, Image, FileText, FileUp, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

export interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
  previewUrl?: string;
  uploading: boolean;
  progress: number;
  url?: string;
}

interface FileUploadButtonProps {
  onFileUploaded: (fileData: {
    id: string;
    type: 'image' | 'document' | 'video' | 'audio' | 'other';
    url: string;
    name: string;
    size: number;
  }) => void;
  disabled?: boolean;
}

export function FileUploadButton({ onFileUploaded, disabled = false }: FileUploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsOpen(false);
    setIsUploading(true);
    
    try {
      // Determine file type
      let fileType: 'image' | 'document' | 'video' | 'audio' | 'other' = 'other';
      
      if (file.type.startsWith('image/')) {
        fileType = 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type.startsWith('audio/')) {
        fileType = 'audio';
      } else if (
        file.type === 'application/pdf' || 
        file.type.includes('document') || 
        file.type.includes('spreadsheet') ||
        file.type.includes('presentation')
      ) {
        fileType = 'document';
      }
      
      // Generate a unique file name to avoid collisions
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Upload to "chat_attachments" bucket in Supabase Storage
      const { data, error } = await supabase.storage
        .from('chat_attachments')
        .upload(`uploads/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(`uploads/${fileName}`);
      
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      // Notify parent component
      onFileUploaded({
        id: uuidv4(),
        type: fileType,
        url: urlData.publicUrl,
        name: file.name,
        size: file.size
      });
      
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const uploadOptions = [
    { icon: <Image className="h-4 w-4 mr-2" />, label: 'Image', accept: 'image/*' },
    { icon: <FileText className="h-4 w-4 mr-2" />, label: 'Document', accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt' },
    { icon: <FileUp className="h-4 w-4 mr-2" />, label: 'Any File', accept: '*/*' }
  ];

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col space-y-1">
            {uploadOptions.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start px-2 py-1 h-auto text-sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = option.accept;
                    fileInputRef.current.click();
                  }
                }}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}
