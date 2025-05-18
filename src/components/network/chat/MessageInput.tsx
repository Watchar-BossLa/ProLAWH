
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";
import { AttachmentType } from "./MessageAttachment";

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

interface MessageInputProps {
  onSendMessage: (message: string, attachments: AttachmentData[]) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, onTyping, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<AttachmentData[]>([]);
  
  const handleSendMessage = () => {
    if (message.trim() === "" && pendingAttachments.length === 0) return;
    
    onSendMessage(message, pendingAttachments);
    setMessage("");
    setPendingAttachments([]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Update typing status
    if (e.target.value.trim() !== '') {
      onTyping(true);
    } else {
      onTyping(false);
    }
  };
  
  const handleFileUploaded = (fileData: {
    id: string;
    type: AttachmentType;
    url: string;
    name: string;
    size: number;
  }) => {
    setPendingAttachments(prev => [...prev, fileData]);
  };
  
  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };
  
  return (
    <>
      {pendingAttachments.length > 0 && (
        <div className="border-t px-3 py-2 flex flex-wrap gap-2 bg-muted/20">
          {pendingAttachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="flex items-center bg-muted rounded-full pl-2 pr-1 py-0.5 text-xs"
            >
              <span className="truncate max-w-[150px] mr-1">{attachment.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5" 
                onClick={() => removePendingAttachment(attachment.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t p-3 bg-muted/20">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <FileUploadButton 
              onFileUploaded={handleFileUploaded}
              disabled={isLoading}
            />
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage} 
              className="rounded-full"
              disabled={isLoading || (message.trim() === '' && pendingAttachments.length === 0)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
