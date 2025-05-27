
import React, { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageAttachment, AttachmentType } from "./MessageAttachment";
import { MessageReactions, MessageReactionsData } from "./MessageReactions";
import { MessageThread } from "./MessageThread";
import { ReadReceipts } from "./ReadReceipts";
import { ChatMessage } from "@/hooks/useRealtimeChat";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string | undefined;
  connectionName: string;
  connectionAvatar?: string;
  isLoading: boolean;
  isTyping: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage?: (parentId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
}

export function MessageList({ 
  messages, 
  currentUserId, 
  connectionName, 
  connectionAvatar,
  isLoading,
  isTyping,
  onReactToMessage,
  onReplyToMessage,
  onMarkAsRead
}: MessageListProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Group messages by thread
  const messageThreads = React.useMemo(() => {
    const threads: { [key: string]: ChatMessage[] } = {};
    const topLevelMessages: ChatMessage[] = [];
    
    messages.forEach(message => {
      if (message.reply_to) {
        if (!threads[message.reply_to]) {
          threads[message.reply_to] = [];
        }
        threads[message.reply_to].push(message);
      } else {
        topLevelMessages.push(message);
      }
    });
    
    return { threads, topLevelMessages };
  }, [messages]);
  
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
  
  const messageGroups = groupMessagesByDate(messageThreads.topLevelMessages);
  
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

  const toggleThreadExpansion = (messageId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedThreads(newExpanded);
  };

  const handleReply = (parentId: string) => {
    onReplyToMessage?.(parentId);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">No messages yet.</p>
          <p className="text-sm text-muted-foreground">Start a conversation!</p>
        </div>
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
            const replies = messageThreads.threads[msg.id] || [];
            const isThreadExpanded = expandedThreads.has(msg.id);
            
            return (
              <div 
                key={msg.id} 
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4 group`}
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
                
                <div className="flex flex-col max-w-[80%] space-y-1">
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
                    
                    <p className="text-xs mt-2 opacity-70">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                  
                  <MessageReactions
                    messageId={msg.id}
                    reactions={msg.reactions}
                    currentUserId={currentUserId}
                    onReact={onReactToMessage}
                  />

                  {msg.read_by && msg.read_by.length > 0 && (
                    <ReadReceipts
                      messageId={msg.id}
                      readBy={msg.read_by.map(reader => ({
                        id: reader.user_id,
                        name: reader.user_name,
                        avatar: reader.user_avatar,
                        readAt: reader.read_at
                      }))}
                      currentUserId={currentUserId}
                    />
                  )}

                  {/* Thread component */}
                  <MessageThread
                    parentMessage={msg}
                    replies={replies}
                    isExpanded={isThreadExpanded}
                    onToggleExpanded={() => toggleThreadExpansion(msg.id)}
                    onReply={handleReply}
                    currentUserId={currentUserId}
                  />
                </div>
                
                {isCurrentUser && (
                  <Avatar className="h-8 w-8 ml-2 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      Me
                    </AvatarFallback>
                  )}
                </div>
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
