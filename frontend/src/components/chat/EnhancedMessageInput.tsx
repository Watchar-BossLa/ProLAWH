import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReplyContext {
  messageId: string;
  content: string;
  senderName: string;
}

interface EnhancedMessageInputProps {
  onSendMessage: (content: string, files?: File[], replyToId?: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading?: boolean;
  replyContext?: ReplyContext;
  onCancelReply?: () => void;
  disabled?: boolean;
}

export function EnhancedMessageInput({
  onSendMessage,
  onTyping,
  isLoading = false,
  replyContext,
  onCancelReply,
  disabled = false
}: EnhancedMessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSend = () => {
    if ((!message.trim() && attachedFiles.length === 0) || isLoading) return;
    
    onSendMessage(message, attachedFiles, replyContext?.messageId);
    setMessage('');
    setAttachedFiles([]);
    onTyping(false);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Handle typing indicator
    if (value.trim()) {
      onTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 3000);
    } else {
      onTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t p-4 space-y-3">
      {/* Reply context */}
      {replyContext && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Replying to {replyContext.senderName}</p>
            <p className="text-sm truncate">{replyContext.content}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancelReply}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* File attachments */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-lg">
              <span className="text-sm truncate max-w-32">{file.name}</span>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="min-h-[40px] max-h-32 resize-none pr-12"
            disabled={disabled}
          />
          
          <Button
            size="icon"
            className="absolute right-1 bottom-1 h-8 w-8"
            onClick={handleSend}
            disabled={(!message.trim() && attachedFiles.length === 0) || isLoading || disabled}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}