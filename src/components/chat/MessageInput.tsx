
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, Smile, Image } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string, attachments: any[], replyTo?: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  replyContext?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  onCancelReply?: () => void;
}

export function MessageInput({ 
  onSendMessage, 
  onTyping, 
  isLoading,
  replyContext,
  onCancelReply
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim() === "" && pendingAttachments.length === 0) return;
    
    onSendMessage(message, pendingAttachments, replyContext?.messageId);
    setMessage("");
    setPendingAttachments([]);
    onCancelReply?.();
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    
    // Update typing status
    if (e.target.value.trim() !== '') {
      onTyping(true);
    } else {
      onTyping(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const attachment = {
        id: Date.now() + Math.random(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        file: file
      };
      
      setPendingAttachments(prev => [...prev, attachment]);
    });
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removePendingAttachment = (id: string | number) => {
    setPendingAttachments(prev => {
      const updated = prev.filter(attachment => attachment.id !== id);
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(attachment => attachment.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const canSend = message.trim() !== "" || pendingAttachments.length > 0;
  
  return (
    <div className="border-t bg-background">
      {/* Reply context */}
      {replyContext && (
        <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-primary rounded" />
            <div>
              <span className="text-sm font-medium">Replying to {replyContext.senderName}</span>
              <p className="text-sm text-muted-foreground truncate max-w-xs">
                {replyContext.content}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Pending attachments */}
      {pendingAttachments.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2 bg-muted/20">
          {pendingAttachments.map((attachment) => (
            <Badge 
              key={attachment.id}
              variant="secondary" 
              className="flex items-center gap-1 pr-1"
            >
              <span className="truncate max-w-[120px]">{attachment.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground" 
                onClick={() => removePendingAttachment(attachment.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              title="Add emoji"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Textarea 
              ref={textareaRef}
              placeholder="Type your message..."
              className="min-h-[50px] max-h-[120px] resize-none pr-12"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage} 
              className="absolute right-2 bottom-2 h-8 w-8 rounded-full"
              disabled={isLoading || !canSend}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {(message.trim() || pendingAttachments.length > 0) && (
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>
              {pendingAttachments.length > 0 && `${pendingAttachments.length} file(s) attached`}
            </span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
