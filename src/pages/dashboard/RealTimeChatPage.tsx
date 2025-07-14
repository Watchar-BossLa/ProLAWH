
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useEnhancedRealTimeChat } from "@/hooks/chat/useEnhancedRealTimeChat";
import { ChatRoomList } from "@/components/chat/ChatRoomList";
import { EnhancedChatMessageList } from "@/components/chat/EnhancedChatMessageList";
import { MessageInput } from "@/components/network/chat/MessageInput";
import { AttachmentType } from "@/components/network/chat/MessageAttachment";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle } from "lucide-react";

interface AttachmentData {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  size?: number;
}

export default function RealTimeChatPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [replyToMessage, setReplyToMessage] = useState<any>(null);

  const {
    chatRooms,
    messages,
    typingUsers,
    currentChat,
    isLoading,
    sendMessage,
    addReaction,
    removeReaction,
    markAsRead,
    updateTypingStatus
  } = useRealTimeChat(selectedChatId);

  const handleSendMessage = async (content: string, attachments: AttachmentData[], replyToId?: string) => {
    if (!content.trim() && attachments.length === 0) return;

    // Handle file attachments (first one for now)
    const fileData = attachments.length > 0 ? {
      url: attachments[0].url,
      name: attachments[0].name,
      size: attachments[0].size || 0
    } : undefined;

    const messageType = attachments.length > 0 
      ? (attachments[0].type === 'image' ? 'image' : 'file')
      : 'text';

    await sendMessage(content || `Shared ${attachments[0]?.name}`, messageType, fileData, replyToId);
    
    // Clear reply context
    setReplyToMessage(null);
  };

  const handleTyping = (isTyping: boolean) => {
    updateTypingStatus(isTyping);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    // Check if user already reacted with this emoji
    const message = messages.find(m => m.id === messageId);
    const existingReaction = message?.reactions.find(r => r.user_id === user?.id && r.reaction === emoji);
    
    if (existingReaction) {
      removeReaction(messageId, emoji);
    } else {
      addReaction(messageId, emoji);
    }
  };

  const handleReplyToMessage = (message: any) => {
    setReplyToMessage(message);
  };

  const handleCancelReply = () => {
    setReplyToMessage(null);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Please log in to access chat</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Chat Rooms List */}
        <div className="lg:col-span-1">
          <ChatRoomList
            chatRooms={chatRooms}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
            isLoading={isLoading}
          />
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedChatId && currentChat ? (
              <>
                {/* Chat Header */}
                <div className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{currentChat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentChat.type === 'group' ? 'Group Chat' : 'Direct Chat'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <EnhancedChatMessageList
                  messages={messages}
                  typingUsers={typingUsers}
                  currentUserId={user.id}
                  onReactToMessage={handleReactToMessage}
                  onReplyToMessage={handleReplyToMessage}
                  onMarkAsRead={markAsRead}
                  isLoading={isLoading}
                />

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  isLoading={isLoading}
                  replyContext={replyToMessage ? {
                    messageId: replyToMessage.id,
                    content: replyToMessage.content || '📎 File',
                    senderName: replyToMessage.sender_profile?.full_name || 'Unknown User'
                  } : undefined}
                  onCancelReply={handleCancelReply}
                />
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to Real-Time Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Select a chat room to start messaging, or create a new conversation.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
