
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Phone, Video, MoreVertical } from "lucide-react";
import { NetworkConnection } from "@/types/network";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { TypingIndicator } from "./chat/TypingIndicator";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";

interface ChatInterfaceProps {
  connection: NetworkConnection;
  onClose?: () => void;
}

export function ChatInterface({ connection, onClose }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { updateTypingStatus, isUserTypingTo } = usePresenceStatus();

  const {
    messages,
    sendMessage,
    addReaction,
    onlineStatus,
    isLoading
  } = useRealtimeChat(connection.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string, attachments: any[]) => {
    if (!message.trim() && attachments.length === 0) return;

    // Handle attachments (simplified for now)
    if (attachments.length > 0) {
      for (const attachment of attachments) {
        await sendMessage({
          content: `Shared file: ${attachment.name}`,
          type: attachment.type === 'image' ? 'image' : 'file',
          file_url: attachment.url,
          file_name: attachment.name
        });
      }
    }

    if (message.trim()) {
      await sendMessage({
        content: message,
        type: 'text'
      });
    }

    // Stop typing indicator
    setIsTyping(false);
    if (user) {
      updateTypingStatus(false, null);
    }
  };

  const handleTyping = (typing: boolean) => {
    setIsTyping(typing);
    if (user) {
      updateTypingStatus(typing, typing ? connection.id : null);
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji);
  };

  const isRecipientTyping = user ? isUserTypingTo(connection.id, user.id) : false;
  const isConnected = onlineStatus === 'online';

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback>
                {connection.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-lg">{connection.name}</CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
                {connection.title && (
                  <Badge variant="secondary" className="text-xs">
                    {connection.title}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <MessageList
          messages={messages}
          currentUserId={user?.id}
          connectionName={connection.name}
          connectionAvatar={connection.avatar}
          isLoading={isLoading}
          isTyping={isRecipientTyping}
          onReactToMessage={handleReactToMessage}
        />

        {isRecipientTyping && (
          <div className="px-4 py-2 border-t">
            <TypingIndicator 
              isTyping={isRecipientTyping} 
              name={connection.name}
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
