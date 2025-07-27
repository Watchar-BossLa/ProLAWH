
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Paperclip, Reply, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessageReactionPicker } from './MessageReactionPicker';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage, TypingIndicator as TypingIndicatorType } from '@/hooks/chat/types';
import { format } from 'date-fns';

interface EnhancedChatMessageListProps {
  messages: ChatMessage[];
  typingUsers: TypingIndicatorType[];
  currentUserId?: string;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage: (message: ChatMessage) => void;
  onMarkAsRead: (messageId: string) => void;
  isLoading: boolean;
}

export function EnhancedChatMessageList({
  messages,
  typingUsers,
  currentUserId,
  onReactToMessage,
  onReplyToMessage,
  onMarkAsRead,
  isLoading
}: EnhancedChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(msg => 
      msg.sender_id !== currentUserId && 
      !msg.read_receipts.some(receipt => receipt.user_id === currentUserId)
    );

    unreadMessages.forEach(msg => {
      onMarkAsRead(msg.id);
    });
  }, [messages, currentUserId, onMarkAsRead]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId;
          const replyToMessage = message.reply_to_id ? 
            messages.find(m => m.id === message.reply_to_id) : null;

          return (
            <div key={message.id} className="group">
              {/* Reply context */}
              {replyToMessage && (
                <div className="text-xs text-muted-foreground mb-1 ml-12 pl-3 border-l-2 border-muted">
                  Replying to: {replyToMessage.content?.substring(0, 50)}...
                </div>
              )}
              
              <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                {!isOwn && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.sender_profile?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {message.sender_profile?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex-1 space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isOwn && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {message.sender_profile?.full_name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), 'HH:mm')}
                      </span>
                      {message.is_edited && (
                        <Badge variant="outline" className="text-xs">
                          Edited
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className={`relative group/message ${
                    isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  } rounded-lg p-3 max-w-md break-words`}>
                    {/* Message content */}
                    {message.message_type === 'text' && message.content && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {message.message_type === 'file' && (
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <a 
                          href={message.file_url} 
                          download={message.file_name}
                          className="text-sm hover:underline"
                        >
                          {message.file_name}
                        </a>
                        {message.file_size && (
                          <span className="text-xs opacity-70">
                            ({(message.file_size / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </div>
                    )}
                    
                    {message.message_type === 'image' && message.file_url && (
                      <div>
                        <img 
                          src={message.file_url} 
                          alt={message.file_name || 'Image'}
                          className="max-w-full h-auto rounded-md mb-2"
                        />
                        {message.content && (
                          <p className="text-sm">{message.content}</p>
                        )}
                      </div>
                    )}

                    {/* Message actions */}
                    <div className="absolute -top-2 right-2 opacity-0 group-hover/message:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => onReplyToMessage(message)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          {isOwn && (
                            <DropdownMenuItem>
                              Edit
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {/* Reactions */}
                  <MessageReactionPicker
                    messageId={message.id}
                    reactions={message.reactions}
                    onAddReaction={onReactToMessage}
                    onRemoveReaction={onReactToMessage}
                  />

                  {/* Read receipts for own messages */}
                  {isOwn && message.read_receipts.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Read by {message.read_receipts.length} user{message.read_receipts.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator 
            typingUsers={typingUsers.map(t => ({ 
              user_id: t.user_id, 
              user_name: 'Someone', // We'd need to fetch user profiles for names
              last_activity: t.last_activity
            }))} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
