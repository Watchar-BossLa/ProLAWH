import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useEnhancedRealTimeChat } from "@/hooks/chat/useEnhancedRealTimeChat";
import { EnhancedMessageList } from "@/components/chat/EnhancedMessageList";
import { EnhancedMessageInput } from "@/components/chat/EnhancedMessageInput";
import { useAuth } from "@/hooks/useAuth";
import { MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RealTimeChatPage() {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>("demo-chat");

  const {
    messages,
    typingUsers,
    isLoading,
    connectionStatus,
    sendMessage,
    addReaction,
    removeReaction,
    updateTypingStatus
  } = useEnhancedRealTimeChat({ chatId: selectedChatId });

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    await sendMessage({ content, type: 'text' });
  };

  const handleTyping = (isTyping: boolean) => {
    updateTypingStatus(isTyping);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    // Check if user already reacted with this emoji
    const message = messages.find(m => m.id === messageId);
    const existingReaction = message?.reactions?.find(r => r.user_id === user?.id && r.emoji === emoji);
    
    if (existingReaction) {
      removeReaction(messageId, emoji);
    } else {
      addReaction(messageId, emoji);
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat Rooms List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <div className="p-4 border-b">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Chat Rooms
              </h2>
            </div>
            <div className="p-4">
              <Button
                variant={selectedChatId === "demo-chat" ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setSelectedChatId("demo-chat")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Demo Chat
              </Button>
              <Button
                variant={selectedChatId === "general" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedChatId("general")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                General
              </Button>
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            {selectedChatId ? (
              <>
                {/* Chat Header */}
                <div className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedChatId === "demo-chat" ? "Demo Chat" : "General"}</h3>
                      <p className="text-sm text-muted-foreground">
                        Enhanced Real-time Chat
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <EnhancedMessageList
                  messages={messages}
                  typingUsers={typingUsers}
                  currentUserId={user.id}
                  connectionStatus={connectionStatus}
                  onReactToMessage={handleReactToMessage}
                  onReplyToMessage={() => {}}
                  onMarkAsRead={() => {}}
                />

                {/* Message Input */}
                <EnhancedMessageInput
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  isLoading={isLoading}
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