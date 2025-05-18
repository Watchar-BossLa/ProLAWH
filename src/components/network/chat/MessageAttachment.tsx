
import React from 'react';
import { FileIcon, ImageIcon, FileTextIcon, FilmIcon, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AttachmentType = 'image' | 'document' | 'video' | 'audio' | 'link' | 'other';

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

interface MessageAttachmentProps {
  attachment: AttachmentData;
}

export function MessageAttachment({ attachment }: MessageAttachmentProps) {
  const handleDownload = () => {
    // Create a hidden anchor element to trigger the download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render different content based on attachment type
  const renderAttachmentContent = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="relative overflow-hidden rounded-md max-w-xs">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-full h-auto max-h-60 object-contain rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              onClick={() => window.open(attachment.url, '_blank')}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
              {attachment.name}
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-2 flex items-center">
              <FilmIcon className="h-4 w-4 mr-2" />
              <span className="text-sm truncate">{attachment.name}</span>
            </div>
            <video 
              controls 
              className="max-w-full max-h-60" 
              src={attachment.url}
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-2 flex items-center">
              <FileIcon className="h-4 w-4 mr-2" />
              <span className="text-sm truncate">{attachment.name}</span>
            </div>
            <audio 
              controls 
              className="w-full" 
              src={attachment.url}
            />
          </div>
        );

      case 'link':
        return (
          <a 
            href={attachment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-2 border rounded-md hover:bg-muted/50 transition-colors"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            <span className="text-sm text-blue-500 underline">{attachment.name || attachment.url}</span>
          </a>
        );
      
      case 'document':
        return (
          <div className="flex items-center p-2 border rounded-md">
            <FileTextIcon className="h-5 w-5 mr-2 text-blue-500" />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{attachment.name}</div>
              {attachment.size && (
                <div className="text-xs text-muted-foreground">
                  {(attachment.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        );

      default:
        return (
          <div className="flex items-center p-2 border rounded-md">
            <FileIcon className="h-5 w-5 mr-2" />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-medium truncate">{attachment.name}</div>
              {attachment.size && (
                <div className="text-xs text-muted-foreground">
                  {(attachment.size / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="mt-2">
      {renderAttachmentContent()}
    </div>
  );
}
