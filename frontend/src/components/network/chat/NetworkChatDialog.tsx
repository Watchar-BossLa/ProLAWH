
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NetworkConnection } from "@/types/network";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";
import { TypingIndicator } from "./TypingIndicator";
import { NetworkConnectionStatus } from "../cards/NetworkConnectionStatus";
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { MessageReactions, MessageReactionsData } from './MessageReactions';

interface NetworkChatDialogProps {
  activeChatId: string | null;
  activeChatConnection?: NetworkConnection;
  onClose: () => void;
}

export function NetworkChatDialog({ activeChatId, activeChatConnection, onClose }: NetworkChatDialogProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { updateTypingStatus, isUserTypingTo } = usePresenceStatus();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { messages, sendMessage, isLoading, addReaction } = useRealTimeChat(
    activeChatId ? activeChatId : ""
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping && activeChatId && user) {
      setIsTyping(true);
      updateTypingStatus(true, activeChatId);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeChatId && user) {
        updateTypingStatus(false, null);
      }
    }, 2000);
  };

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

  const handleSendMessage = () => {
    if (!message.trim() || !activeChatId || !user) return;
    
    sendMessage({ content: message, type: 'text' });
    
    setMessage("");
    setIsTyping(false);
    if (activeChatId) {
      updateTypingStatus(false, null);
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (user) {
      addReaction(messageId, emoji);
    }
  };

  // Convert reactions array to reactions data format
  const convertReactionsToData = (reactions: any): MessageReactionsData => {
    if (Array.isArray(reactions)) {
      const reactionsData: MessageReactionsData = {};
      reactions.forEach(reaction => {
        if (!reactionsData[reaction.reaction]) {
          reactionsData[reaction.reaction] = [];
        }
        reactionsData[reaction.reaction].push(reaction);
      });
      return reactionsData;
    }
    return reactions || {};
  };

  if (!activeChatId || !activeChatConnection) return null;

  const isRecipientTyping = user ? isUserTypingTo(activeChatId, user.id) : false;

  return (
    <Dialog open={!!activeChatId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogTitle>Chat with {activeChatConnection.name}</DialogTitle>
        <DialogDescription>Exchange messages and collaborate in real time.</DialogDescription>
        <div className="flex justify-between items-center mb-4">
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
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 border rounded-md mb-4 h-[300px] space-y-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] break-words ${
                    msg.sender_id === user?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary'
                  }`}
                >
                  {msg.content}
                </div>
                
                <MessageReactions
                  messageId={msg.id}
                  reactions={convertReactionsToData(msg.reactions)}
                  currentUserId={user?.id}
                  onReact={handleReactToMessage}
                />
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
          
          {isRecipientTyping && (
            <TypingIndicator 
              isTyping={isRecipientTyping} 
              name={activeChatConnection.name} 
              className="ml-2"
            />
          )}
        </div>
        
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
