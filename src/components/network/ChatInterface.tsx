
import React, { useState, useRef, useEffect } from "react";
import { NetworkConnection } from "@/types/network";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { AttachmentType } from "./chat/MessageAttachment";

interface ChatInterfaceProps {
  connection: NetworkConnection;
  onClose: () => void;
}

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

export function ChatInterface({ connection, onClose }: ChatInterfaceProps) {
  const { user } = useAuth();
  
  // Use the realtime chat hook with proper recipient ID
  const { 
    messages, 
    isLoading, 
    sendMessage 
  } = useRealtimeChat(connection.id);
  
  const { updateTypingStatus, isUserTypingTo } = usePresenceStatus();
  const isRecipientTyping = user ? isUserTypingTo(connection.id, user.id) : false;
  
  const handleSendMessage = async (messageText: string, attachments: AttachmentData[]) => {
    if ((!messageText.trim() && attachments.length === 0) || !user) return;
    
    // Disable typing indicator
    updateTypingStatus(false);
    
    // Send message with correct parameters and any attachments
    try {
      await sendMessage({
        content: messageText,
        sender_id: user.id,
        receiver_id: connection.id,
        attachment_data: attachments.length > 0 ? attachments : undefined
      });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  
  const handleTypingUpdate = (isTyping: boolean) => {
    if (user && connection.id) {
      updateTypingStatus(isTyping, isTyping ? connection.id : null);
    }
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-card overflow-hidden">
      <ChatHeader connection={connection} onClose={onClose} />
      
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        connectionName={connection.name}
        connectionAvatar={connection.avatar}
        isLoading={isLoading}
        isTyping={isRecipientTyping}
      />
      
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTypingUpdate}
        isLoading={isLoading}
      />
    </div>
  );
}
