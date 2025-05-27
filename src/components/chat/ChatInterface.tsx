
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Video, MoreVertical, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { ChatHeader } from "./ChatHeader";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

interface ChatInterfaceProps {
  chatId: string;
  chatName?: string;
}

export function ChatInterface({ chatId, chatName = "Chat" }: ChatInterfaceProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    addReaction,
    isOnline
  } = useChatMessages(chatId);
  
  const {
    typingUsers,
    sendTypingIndicator
  } = useTypingIndicator(chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, attachments: any[], replyTo?: string) => {
    if (!content.trim() && attachments.length === 0) return;

    // Handle attachments (simplified for now)
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        await sendMessage({
          content: `Shared file: ${attachment.name}`,
          message_type: attachment.type === 'image' ? 'image' : 'file',
          file_url: attachment.url,
          file_name: attachment.name,
          reply_to_id: replyTo
        });
      }
    }

    if (content.trim()) {
      await sendMessage({
        content: content,
        message_type: 'text',
        reply_to_id: replyTo
      });
    }
  };

  const handleTyping = (isTyping: boolean) => {
    sendTypingIndicator(isTyping);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji);
  };

  const isAnyoneTyping = typingUsers.length > 0;

  return (
    <Card className="h-full flex flex-col">
      <ChatHeader 
        chatName={chatName}
        isOnline={isOnline}
        participantCount={0} // TODO: Get actual participant count
      />

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          isLoading={isLoading}
          onReactToMessage={handleReactToMessage}
        />

        {isAnyoneTyping && (
          <div className="px-4 py-2 border-t">
            <TypingIndicator 
              typingUsers={typingUsers}
            />
          </div>
        )}

        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
