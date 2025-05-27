
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageReactions } from "./MessageReactions";
import { Paperclip, Reply } from "lucide-react";

interface Message {
  id: string;
  content?: string;
  sender_id: string;
  created_at: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
  reply_to_id?: string;
  reactions?: Record<string, string[]>;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
  isLoading: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  isLoading,
  onReactToMessage
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-sm text-muted-foreground">Start a conversation!</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-4 py-4">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date} className="mb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {formatDate(date)}
              </div>
            </div>
            
            {dateMessages.map((msg) => {
              const isCurrentUser = currentUserId && msg.sender_id === currentUserId;
              const senderName = msg.profiles?.full_name || 'Unknown';
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4 group`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      {msg.profiles?.avatar_url ? (
                        <AvatarImage src={msg.profiles.avatar_url} alt={senderName} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {senderName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col max-w-[80%] space-y-1">
                    {!isCurrentUser && (
                      <span className="text-xs text-muted-foreground ml-3">
                        {senderName}
                      </span>
                    )}
                    
                    <div 
                      className={`rounded-lg p-3 ${
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {msg.reply_to_id && (
                        <div className="mb-2 opacity-70 text-xs border-l-2 border-current pl-2">
                          <Reply className="h-3 w-3 inline mr-1" />
                          Replying to message
                        </div>
                      )}
                      
                      {msg.content && (
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                      
                      {msg.file_url && (
                        <div className="mt-2">
                          {msg.message_type === 'image' ? (
                            <img 
                              src={msg.file_url} 
                              alt={msg.file_name || 'Image'} 
                              className="max-w-full h-auto rounded"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 bg-background/10 rounded border">
                              <Paperclip className="h-4 w-4" />
                              <a 
                                href={msg.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                              >
                                {msg.file_name || 'File'}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs mt-2 opacity-70">
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                    
                    <MessageReactions
                      messageId={msg.id}
                      reactions={msg.reactions || {}}
                      currentUserId={currentUserId}
                      onReact={onReactToMessage}
                    />
                  </div>
                  
                  {isCurrentUser && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        Me
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
