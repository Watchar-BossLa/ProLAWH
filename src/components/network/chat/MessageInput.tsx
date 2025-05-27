
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, Reply } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";
import { EnhancedFileUpload } from "./EnhancedFileUpload";
import { AttachmentType } from "./MessageAttachment";

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

interface ReplyContext {
  messageId: string;
  content: string;
  senderName: string;
}

interface MessageInputProps {
  onSendMessage: (message: string, attachments: AttachmentData[], replyTo?: string) => void;
  onTyping: (isTyping: boolean) => void;
  isLoading: boolean;
  replyContext?: ReplyContext;
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
  const [pendingAttachments, setPendingAttachments] = useState<AttachmentData[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
  
  const handleFileUploaded = (fileData: {
    id: string;
    type: string;
    url: string;
    name: string;
    size: number;
  }) => {
    const attachment: AttachmentData = {
      id: fileData.id,
      type: fileData.type.startsWith('image/') ? 'image' : 
            fileData.type === 'application/pdf' ? 'document' : 'file',
      url: fileData.url,
      name: fileData.name,
      size: fileData.size
    };
    
    setPendingAttachments(prev => [...prev, attachment]);
    setShowFileUpload(false);
  };
  
  const removePendingAttachment = (id: string) => {
    setPendingAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const canSend = message.trim() !== "" || pendingAttachments.length > 0;
  
  return (
    <div className="border-t bg-background">
      {/* Reply context */}
      {replyContext && (
        <div className="px-4 py-2 bg-muted/50 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Reply className="h-4 w-4 text-muted-foreground" />
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

      {/* Enhanced file upload zone */}
      {showFileUpload && (
        <div className="p-4 border-b">
          <EnhancedFileUpload
            onFileUploaded={handleFileUploaded}
            onCancel={() => setShowFileUpload(false)}
            multiple={true}
            className="max-h-64"
          />
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-2">
            <FileUploadButton 
              onFileUploaded={handleFileUploaded}
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={isLoading}
              className={showFileUpload ? "bg-muted" : ""}
            >
              <Paperclip className="h-4 w-4" />
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
    </div>
  );
}
