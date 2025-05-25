
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageAttachment, AttachmentType } from "./MessageAttachment";
import { MessageReactions, MessageReactionsData } from "./MessageReactions";

interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reactions?: MessageReactionsData;
  sender_name: string;
  sender_avatar?: string;
}

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string | undefined;
  connectionName: string;
  connectionAvatar?: string;
  isLoading: boolean;
  isTyping: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  connectionName, 
  connectionAvatar,
  isLoading,
  isTyping,
  onReactToMessage
}: MessageListProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  
  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [date: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className="mb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
              {formatDate(date)}
            </div>
          </div>
          
          {dateMessages.map((msg) => {
            const isCurrentUser = currentUserId && msg.sender_id === currentUserId;
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    {msg.sender_avatar ? (
                      <AvatarImage src={msg.sender_avatar} alt={msg.sender_name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {msg.sender_name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div className="flex flex-col max-w-[80%]">
                  <div 
                    className={`rounded-lg p-3 ${
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    {msg.content && (
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                    )}
                    
                    {msg.file_url && (
                      <div className="mt-2">
                        <MessageAttachment 
                          attachment={{
                            id: msg.id,
                            type: msg.type as AttachmentType,
                            url: msg.file_url,
                            name: msg.file_name || 'File'
                          }} 
                        />
                      </div>
                    )}
                    
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(msg.timestamp)}
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
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      ))}
      
      {isTyping && (
        <div className="flex justify-start mb-2">
          <div className="bg-muted rounded-lg px-4 py-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messageEndRef} />
    </div>
  );
}
