
import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Reply, MoreVertical, Check, CheckCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChatMessage, TypingIndicator } from "@/hooks/useRealTimeChat";
import { MessageReactions } from "./MessageReactions";
import { TypingIndicator as TypingComponent } from "./TypingIndicator";
import { format } from "date-fns";

interface EnhancedChatMessageListProps {
  messages: ChatMessage[];
  typingUsers: TypingIndicator[];
  currentUserId?: string;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage?: (message: ChatMessage) => void;
  onMarkAsRead?: (messageId: string) => void;
  isLoading?: boolean;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Mark messages as read when they become visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId && !visibleMessages.has(messageId)) {
              setVisibleMessages(prev => new Set([...prev, messageId]));
              onMarkAsRead?.(messageId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const messageElements = document.querySelectorAll('[data-message-id]');
    messageElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [messages, visibleMessages, onMarkAsRead]);

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

  const groupMessagesByDate = (messages: ChatMessage[]) => {
    const groups: { [date: string]: ChatMessage[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const getReadStatus = (message: ChatMessage) => {
    if (message.sender_id === currentUserId) {
      const readByOthers = message.read_receipts.filter(receipt => receipt.user_id !== currentUserId);
      if (readByOthers.length > 0) {
        return 'read';
      }
      return 'sent';
    }
    return null;
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

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No messages yet</h3>
          <p className="text-muted-foreground">Start the conversation by sending a message!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex justify-center my-4">
                <Badge variant="outline" className="text-xs px-3 py-1">
                  {formatDate(date)}
                </Badge>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dateMessages.map((message, index) => {
                  const isCurrentUser = message.sender_id === currentUserId;
                  const showAvatar = !isCurrentUser && (
                    index === 0 || 
                    dateMessages[index - 1]?.sender_id !== message.sender_id
                  );
                  const readStatus = getReadStatus(message);

                  return (
                    <div
                      key={message.id}
                      data-message-id={message.id}
                      className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
                    >
                      {!isCurrentUser && (
                        <div className="flex flex-col items-end">
                          {showAvatar ? (
                            <Avatar className="h-8 w-8">
                              {message.sender_profile?.avatar_url ? (
                                <AvatarImage src={message.sender_profile.avatar_url} />
                              ) : (
                                <AvatarFallback>
                                  {message.sender_profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8" />
                          )}
                        </div>
                      )}

                      <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isCurrentUser && (
                          <span className="text-xs text-muted-foreground mb-1 px-3">
                            {message.sender_profile?.full_name || 'Unknown User'}
                          </span>
                        )}

                        {/* Reply context */}
                        {message.reply_to && (
                          <div className="mb-2 p-2 bg-muted/50 rounded-lg text-sm max-w-full">
                            <div className="flex items-center gap-2 mb-1">
                              <Reply className="h-3 w-3" />
                              <span className="font-medium">
                                {message.reply_to.sender_id === currentUserId ? 'You' : 'Someone'}
                              </span>
                            </div>
                            <p className="text-muted-foreground truncate">
                              {message.reply_to.content || '📎 File'}
                            </p>
                          </div>
                        )}

                        <div
                          className={`relative rounded-lg p-3 max-w-full break-words ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {/* Message content */}
                          {message.content && (
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          )}

                          {/* File attachment */}
                          {message.file_url && (
                            <div className="mt-2">
                              {message.message_type === 'image' ? (
                                <img
                                  src={message.file_url}
                                  alt={message.file_name || 'Image'}
                                  className="max-w-full h-auto rounded border"
                                />
                              ) : (
                                <div className="flex items-center gap-2 p-2 bg-background/10 rounded border">
                                  <div className="flex-1">
                                    <p className="font-medium truncate">{message.file_name}</p>
                                    {message.file_size && (
                                      <p className="text-xs opacity-70">
                                        {(message.file_size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                                      Open
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Message timestamp and status */}
                          <div className={`flex items-center gap-1 mt-2 text-xs ${
                            isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            <span>{formatTime(message.created_at)}</span>
                            {message.edited_at && <span>• edited</span>}
                            
                            {isCurrentUser && readStatus && (
                              <div className="ml-1">
                                {readStatus === 'read' ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Message actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => onReplyToMessage?.(message)}>
                                <Reply className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Message reactions */}
                        <MessageReactions
                          message={message}
                          onAddReaction={onReactToMessage}
                          onRemoveReaction={onReactToMessage}
                        />

                        {/* Read receipts for group chats */}
                        {message.read_receipts.length > 0 && isCurrentUser && (
                          <div className="flex items-center gap-1 mt-1">
                            {message.read_receipts
                              .filter(receipt => receipt.user_id !== currentUserId)
                              .slice(0, 3)
                              .map(receipt => (
                                <Avatar key={receipt.id} className="h-4 w-4">
                                  {receipt.user_profile?.avatar_url ? (
                                    <AvatarImage src={receipt.user_profile.avatar_url} />
                                  ) : (
                                    <AvatarFallback className="text-xs">
                                      {receipt.user_profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                              ))}
                          </div>
                        )}
                      </div>

                      {isCurrentUser && (
                        <div className="h-8 w-8" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {typingUsers[0].user_profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <TypingComponent
                  typingUsers={typingUsers.map(user => ({
                    user_id: user.user_id,
                    user_name: user.user_profile?.full_name,
                    last_activity: user.last_activity
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </ScrollArea>
  );
}
