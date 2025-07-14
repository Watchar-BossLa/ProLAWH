import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  Download,
  Reply,
  Smile,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { ChatMessage, TypingIndicator } from "@/hooks/chat/useEnhancedRealTimeChat";
import { cn } from "@/lib/utils";

interface EnhancedMessageListProps {
  messages: ChatMessage[];
  typingUsers: TypingIndicator[];
  currentUserId?: string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage: (message: ChatMessage) => void;
  onMarkAsRead: (messageIds: string[]) => void;
  searchTerm?: string;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏'];

export function EnhancedMessageList({
  messages,
  typingUsers,
  currentUserId,
  connectionStatus,
  onReactToMessage,
  onReplyToMessage,
  onMarkAsRead,
  searchTerm
}: EnhancedMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Mark visible messages as read
  useEffect(() => {
    if (!currentUserId) return;
    
    const unreadMessages = messages.filter(msg => 
      msg.sender_id !== currentUserId && 
      !msg.read_by.includes(currentUserId)
    );
    
    if (unreadMessages.length > 0) {
      onMarkAsRead(unreadMessages.map(msg => msg.id));
    }
  }, [messages, currentUserId, onMarkAsRead]);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM dd, yyyy');
    }
  };

  const shouldShowDateHeader = (message: ChatMessage, index: number) => {
    if (index === 0) return true;
    
    const currentDate = new Date(message.created_at);
    const previousDate = new Date(messages[index - 1].created_at);
    
    return !isToday(currentDate) || 
           currentDate.toDateString() !== previousDate.toDateString();
  };

  const shouldGroupMessage = (message: ChatMessage, index: number) => {
    if (index === 0) return false;
    
    const previousMessage = messages[index - 1];
    const timeDiff = differenceInMinutes(
      new Date(message.created_at), 
      new Date(previousMessage.created_at)
    );
    
    return previousMessage.sender_id === message.sender_id && timeDiff < 5;
  };

  const getMessageStatusIcon = (message: ChatMessage) => {
    if (message.sender_id !== currentUserId) return null;
    
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  const highlightSearchTerm = (text: string, term?: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const renderFilePreview = (message: ChatMessage) => {
    if (!message.file_url) return null;

    if (message.message_type === 'image') {
      return (
        <div className="mt-2 max-w-sm">
          <img
            src={message.file_url}
            alt={message.file_name || 'Image'}
            className="rounded-lg max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(message.file_url, '_blank')}
          />
        </div>
      );
    } else if (message.message_type === 'file') {
      return (
        <div className="mt-2 p-3 bg-muted rounded-lg border max-w-sm">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{message.file_name}</p>
              <p className="text-xs text-muted-foreground">File</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(message.file_url, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderReactions = (message: ChatMessage) => {
    if (!message.reactions.length) return null;

    const reactionCounts = message.reactions.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {Object.entries(reactionCounts).map(([emoji, count]) => {
          const userReacted = message.reactions.some(r => 
            r.emoji === emoji && r.user_id === currentUserId
          );
          
          return (
            <Button
              key={emoji}
              variant={userReacted ? "default" : "outline"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onReactToMessage(message.id, emoji)}
            >
              {emoji} {count}
            </Button>
          );
        })}
        
        {/* Quick react button */}
        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Smile className="h-3 w-3" />
          </Button>
          
          {/* Emoji picker overlay */}
          <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex bg-popover border rounded-lg shadow-lg p-2 gap-1 z-10">
            {COMMON_EMOJIS.map(emoji => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onReactToMessage(message.id, emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (messages.length === 0 && typingUsers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No messages yet</h3>
          <p className="text-muted-foreground">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Connection status */}
      <div className={cn(
        "px-4 py-2 text-xs text-center transition-all duration-200",
        connectionStatus === 'connected' && "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        connectionStatus === 'connecting' && "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
        connectionStatus === 'disconnected' && "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      )}>
        {connectionStatus === 'connected' && "Connected"}
        {connectionStatus === 'connecting' && "Connecting..."}
        {connectionStatus === 'disconnected' && "Disconnected - trying to reconnect"}
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
        <div className="space-y-1 py-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const isGrouped = shouldGroupMessage(message, index);
            const showDateHeader = shouldShowDateHeader(message, index);

            return (
              <div key={message.id}>
                {/* Date header */}
                {showDateHeader && (
                  <div className="flex items-center justify-center py-4">
                    <Separator className="flex-1" />
                    <Badge variant="secondary" className="mx-3 text-xs">
                      {formatDateHeader(message.created_at)}
                    </Badge>
                    <Separator className="flex-1" />
                  </div>
                )}

                {/* Message */}
                <div className={cn(
                  "flex gap-3 group hover:bg-muted/30 rounded-lg p-2 transition-colors",
                  isOwnMessage && "flex-row-reverse",
                  isGrouped && "mt-1"
                )}>
                  {/* Avatar */}
                  {!isGrouped && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender_profile?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {message.sender_profile?.full_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {isGrouped && <div className="w-8" />}

                  {/* Message content */}
                  <div className={cn(
                    "flex-1 min-w-0 max-w-md",
                    isOwnMessage && "flex flex-col items-end"
                  )}>
                    {/* Sender info */}
                    {!isGrouped && (
                      <div className={cn(
                        "flex items-center gap-2 mb-1",
                        isOwnMessage && "justify-end"
                      )}>
                        <span className="font-medium text-sm">
                          {isOwnMessage ? 'You' : message.sender_profile?.full_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.created_at)}
                        </span>
                        {getMessageStatusIcon(message)}
                      </div>
                    )}

                    {/* Reply context */}
                    {message.reply_to_id && (
                      <div className="mb-2 p-2 bg-muted/50 rounded border-l-2 border-primary">
                        <p className="text-xs text-muted-foreground">Replying to message</p>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div className={cn(
                      "rounded-lg p-3 break-words",
                      isOwnMessage 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted"
                    )}>
                      {message.content && (
                        <p className="text-sm whitespace-pre-wrap">
                          {highlightSearchTerm(message.content, searchTerm)}
                        </p>
                      )}
                      
                      {renderFilePreview(message)}
                    </div>

                    {/* Reactions */}
                    {renderReactions(message)}

                    {/* Read receipts */}
                    {isOwnMessage && message.read_by.length > 0 && (
                      <div className="flex -space-x-1 mt-1 justify-end">
                        {message.read_by.slice(0, 3).map((userId, idx) => (
                          <div
                            key={userId}
                            className="w-4 h-4 rounded-full bg-primary border border-background flex items-center justify-center"
                            title="Read"
                          >
                            <Check className="h-2 w-2 text-primary-foreground" />
                          </div>
                        ))}
                        {message.read_by.length > 3 && (
                          <div className="w-4 h-4 rounded-full bg-muted border border-background flex items-center justify-center text-xs">
                            +{message.read_by.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick actions */}
                    <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => onReplyToMessage(message)}
                      >
                        <Reply className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicators */}
          {typingUsers.length > 0 && (
            <div className="flex gap-3 p-2 animate-pulse">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {typingUsers[0].user_profile?.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}