
import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageAttachment, AttachmentType } from "./MessageAttachment";
import { MessageReactions, MessageReactionsData } from "./MessageReactions";

interface MessageAttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachment_data?: MessageAttachmentData[];
  reactions?: MessageReactionsData;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
  connectionName: string;
  connectionAvatar?: string;
  isLoading: boolean;
  isTyping: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  searchQuery?: string;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  connectionName, 
  connectionAvatar,
  isLoading,
  isTyping,
  onReactToMessage,
  messagesEndRef,
  searchQuery = ""
}: MessageListProps) {
  
  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    
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

  // Function to highlight search terms in text
  const highlightSearchTerms = (text: string, searchTerm: string) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return text;
    }
    
    // Split the text by the search term to create an array of parts
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
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
                    {connectionAvatar ? (
                      <AvatarImage src={connectionAvatar} alt={connectionName} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {connectionName.substring(0, 2).toUpperCase()}
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
                    {/* Message content with search highlighting */}
                    {msg.content && (
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {searchQuery ? highlightSearchTerms(msg.content, searchQuery) : msg.content}
                      </p>
                    )}
                    
                    {/* Attachments */}
                    {msg.attachment_data && msg.attachment_data.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachment_data.map((attachment) => (
                          <MessageAttachment 
                            key={attachment.id} 
                            attachment={attachment} 
                          />
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs mt-1 opacity-70">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  
                  {/* Message reactions */}
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
      
      <div ref={messagesEndRef} />
    </div>
  );
}
