
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { MessageReactionPicker } from '../MessageReactionPicker';
import { TypingIndicator } from '../TypingIndicator';

interface ChatMessage {
  id: string;
  content: string;
  type: 'text' | 'file' | 'image';
  sender_name?: string;
  sender_avatar?: string;
  timestamp: string;
  file_url?: string;
  file_name?: string;
  reply_to_id?: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  typingUsers: any[];
  isSearchActive: boolean;
  onReplyToMessage: (message: ChatMessage) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
}

export function ChatMessageList({
  messages,
  typingUsers,
  isSearchActive,
  onReplyToMessage,
  onAddReaction,
  onRemoveReaction
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            {msg.reply_to_id && (
              <div className="text-xs text-muted-foreground mb-1 ml-12 pl-3 border-l-2 border-muted">
                Replying to: {messages.find(m => m.id === msg.reply_to_id)?.content.substring(0, 50)}...
              </div>
            )}
            
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={msg.sender_avatar} />
                <AvatarFallback className="text-xs">
                  {msg.sender_name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{msg.sender_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  {isSearchActive && (
                    <Badge variant="outline" className="text-xs">
                      Match
                    </Badge>
                  )}
                </div>
                
                <div className="bg-muted rounded-lg p-3">
                  {msg.type === 'text' && (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  
                  {msg.type === 'file' && (
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <a 
                        href={msg.file_url} 
                        download={msg.file_name}
                        className="text-sm text-primary hover:underline"
                      >
                        {msg.file_name}
                      </a>
                    </div>
                  )}
                  
                  {msg.type === 'image' && (
                    <img 
                      src={msg.file_url} 
                      alt={msg.file_name}
                      className="max-w-sm rounded-md"
                    />
                  )}
                </div>
                
                <MessageReactionPicker
                  messageId={msg.id}
                  reactions={[]}
                  onAddReaction={onAddReaction}
                  onRemoveReaction={onRemoveReaction}
                />
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReplyToMessage(msg)}
                    className="text-xs"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <TypingIndicator typingUsers={typingUsers} />
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
