
import React from "react";
import { NetworkConnection } from "@/types/network";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { useChatHandlers } from "@/hooks/useChatHandlers";

interface ChatInterfaceProps {
  connection: NetworkConnection;
  onClose: () => void;
}

export function ChatInterface({ connection, onClose }: ChatInterfaceProps) {
  const { user } = useAuth();
  
  const { 
    messages, 
    isLoading, 
    sendMessage,
    reactToMessage
  } = useRealtimeChat(connection.id);
  
  const { updateTypingStatus, isUserTypingTo } = usePresenceStatus();
  const isRecipientTyping = user ? isUserTypingTo(connection.id, user.id) : false;
  
  const {
    handleSendMessage,
    handleTypingUpdate,
    handleReactToMessage
  } = useChatHandlers({
    user,
    updateTypingStatus,
    sendMessage,
    reactToMessage
  });
  
  const onSendMessage = (messageText: string, attachments: any[]) => {
    handleSendMessage(messageText, attachments, connection.id);
  };
  
  const onTypingUpdate = (isTyping: boolean) => {
    handleTypingUpdate(isTyping, connection.id);
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
        onReactToMessage={handleReactToMessage}
      />
      
      <MessageInput
        onSendMessage={onSendMessage}
        onTyping={onTypingUpdate}
        isLoading={isLoading}
      />
    </div>
  );
}
