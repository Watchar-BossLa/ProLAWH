import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Paperclip } from "lucide-react";
import { NetworkConnection } from "@/types/network";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { NetworkConnectionStatus } from "../cards/NetworkConnectionStatus";
import { TypingIndicator } from "./TypingIndicator";

interface NetworkChatDialogProps {
  activeChatId: string | null;
  activeChatConnection: NetworkConnection | undefined;
  onClose: () => void;
}

export function NetworkChatDialog({ activeChatId, activeChatConnection, onClose }: NetworkChatDialogProps) {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    updateTypingStatus(e.target.value.trim() !== '');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    await sendMessage(messageText);
    setMessageText('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId]);

  const { messages, loading, isTyping, sendMessage, updateTypingStatus } = useRealtimeChat({
    connectionId: activeChatId
  });

  return (
    <Dialog open={!!activeChatId} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {activeChatConnection ? (
              <>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <span className="font-medium">{activeChatConnection.name.charAt(0)}</span>
                </div>
                <div className="flex flex-col">
                  <span>{activeChatConnection.name}</span>
                  <NetworkConnectionStatus 
                    userId={activeChatId || ''}
                    showLabel
                    className="text-xs"
                  />
                </div>
              </>
            ) : (
              'Chat'
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message</p>
            </div>
          ) : (
            messages.map(message => (
              <div 
                key={message.id}
                className={`flex ${message.senderId === activeChatId ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg px-3 py-2 ${
                    message.senderId === activeChatId ? 'bg-muted' : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="break-words">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Paperclip className="h-3 w-3" />
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs underline"
                          >
                            {attachment.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-[10px] text-right mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <TypingIndicator 
              isTyping={isTyping} 
              name={activeChatConnection?.name}
            />
          )}
        </div>
        
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={handleMessageChange}
            className="flex-1"
          />
          <Button type="submit" disabled={!messageText.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
