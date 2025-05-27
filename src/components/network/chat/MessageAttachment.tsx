
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { File, Image, FileText, Download, ExternalLink } from "lucide-react";

export type AttachmentType = 'image' | 'file' | 'document';

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

interface MessageAttachmentProps {
  attachment: AttachmentData;
  compact?: boolean;
}

export function MessageAttachment({ attachment, compact = false }: MessageAttachmentProps) {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    window.open(attachment.url, '_blank');
  };

  if (attachment.type === 'image') {
    return (
      <div className="space-y-2">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-sm max-h-64 rounded-md object-contain cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handlePreview}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{attachment.name}</span>
          {attachment.size && <span>{formatFileSize(attachment.size)}</span>}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border max-w-xs">
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          {attachment.size && (
            <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="shrink-0"
        >
          <Download className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded">
            {getFileIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{attachment.name}</h4>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {attachment.type}
              </Badge>
              {attachment.size && (
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.size)}
                </span>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-1"
              >
                <Download className="h-3 w-3" />
                Download
              </Button>
              
              {(attachment.type === 'image' || attachment.type === 'document') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreview}
                  className="gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Preview
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
