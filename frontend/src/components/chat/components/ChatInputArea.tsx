
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';
import { FileUploadZone } from '../FileUpload/FileUploadZone';

interface ChatInputAreaProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  showFileUpload: boolean;
  onToggleFileUpload: () => void;
  onFileUpload: (files: File[]) => void;
  replyToMessage?: any;
  onCancelReply: () => void;
}

export function ChatInputArea({
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  showFileUpload,
  onToggleFileUpload,
  onFileUpload,
  replyToMessage,
  onCancelReply
}: ChatInputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload([file]);
  };

  return (
    <>
      {showFileUpload && (
        <div className="border-b p-4">
          <FileUploadZone
            onFileUpload={onFileUpload}
            onCancel={() => onToggleFileUpload()}
          />
        </div>
      )}

      {replyToMessage && (
        <div className="px-4 py-2 bg-muted/50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Replying to: {replyToMessage.content.substring(0, 50)}...
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={onKeyPress}
              className="resize-none"
            />
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFileUpload}
            className={showFileUpload ? 'bg-muted' : ''}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={onSendMessage}
            disabled={!message.trim()}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
