
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NetworkConnection } from "@/types/network";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";
import { TypingIndicator } from "./TypingIndicator";
import { NetworkConnectionStatus } from "../cards/NetworkConnectionStatus";
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { MessageReactions } from './MessageReactions';
import { MessageInput } from './MessageInput';
import { SearchInput } from './SearchInput';
import { MessageList } from './MessageList';
import { AttachmentType } from './MessageAttachment';

interface NetworkChatDialogProps {
  activeChatId: string | null;
  activeChatConnection?: NetworkConnection;
  onClose: () => void;
}

export function NetworkChatDialog({ activeChatId, activeChatConnection, onClose }: NetworkChatDialogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { updateTypingStatus, isUserTypingTo } = usePresenceStatus();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Use the real-time chat hook
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    reactToMessage,
    searchMessages,
    searchQuery,
    clearSearch,
    hasSearchResults
  } = useRealtimeChat(
    activeChatId ? activeChatId : null
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing status
  const handleTyping = (isTyping: boolean) => {
    if (isTyping !== isTyping && activeChatId && user) {
      setIsTyping(isTyping);
      updateTypingStatus(isTyping, isTyping ? activeChatId : null);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to stop typing indicator
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        if (activeChatId && user) {
          updateTypingStatus(false, null);
        }
      }, 2000);
    }
  };

  // Clear typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (activeChatId && user) {
        updateTypingStatus(false, null);
      }
    };
  }, [activeChatId, user, updateTypingStatus]);

  const handleSendMessage = (messageText: string, attachments: {
    id: string;
    type: AttachmentType;
    url: string;
    name: string;
    size?: number;
  }[]) => {
    if ((!messageText.trim() && attachments.length === 0) || !activeChatId || !user) return;
    
    sendMessage({
      content: messageText,
      sender_id: user.id,
      receiver_id: activeChatId,
      attachment_data: attachments.length > 0 ? attachments : undefined
    });
    
    // Clear typing status
    setIsTyping(false);
    if (activeChatId) {
      updateTypingStatus(false, null);
    }
  };

  // Handler for message reactions
  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (user) {
      reactToMessage(messageId, emoji);
    }
  };

  if (!activeChatId || !activeChatConnection) return null;

  const isRecipientTyping = user ? isUserTypingTo(activeChatId, user.id) : false;

  return (
    <Dialog open={!!activeChatId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-semibold">{activeChatConnection.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold">{activeChatConnection.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <NetworkConnectionStatus userId={activeChatId} showLabel />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SearchInput 
              onSearch={searchMessages}
              searchQuery={searchQuery}
              clearSearch={clearSearch}
              hasSearchResults={hasSearchResults}
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          connectionName={activeChatConnection.name}
          connectionAvatar={activeChatConnection.avatar}
          isLoading={isLoading}
          isTyping={isRecipientTyping}
          onReactToMessage={handleReactToMessage}
          messagesEndRef={messagesEndRef}
          searchQuery={searchQuery}
        />
        
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
