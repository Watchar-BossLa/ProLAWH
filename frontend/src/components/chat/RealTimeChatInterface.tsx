import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, Wifi, WifiOff } from "lucide-react";
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { MessageReactionPicker } from "./MessageReactionPicker";
import { FileUploadZone } from "./FileUploadZone";
import { TypingIndicator } from "./TypingIndicator";
import { format } from "date-fns";

interface RealTimeChatInterfaceProps {
  chatId: string;
  chatName?: string;
}

export function RealTimeChatInterface({ chatId, chatName = "Chat" }: RealTimeChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    messages,
    typingUsers,
    onlineStatus,
    isLoading,
    sendMessage,
    addReaction,
    removeReaction,
    sendTypingIndicator,
    uploadFile
  } = useRealTimeChat(chatId);

  const isConnected = onlineStatus === 'online';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage({ content: inputValue, type: 'text' });
    setInputValue("");
    setIsTyping(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
    } else if (!value.trim() && isTyping) {
      setIsTyping(false);
      sendTypingIndicator(false);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false);
    }, 3000);
  };

  const handleFileUpload = async (file: File) => {
    const uploadedFile = await uploadFile(file);
    if (uploadedFile) {
      const messageType = file.type.startsWith('image/') ? 'image' : 'file';
      await sendMessage({
        content: `Shared ${messageType}: ${file.name}`,
        type: messageType,
        file_url: uploadedFile.url,
        file_name: uploadedFile.name
      });
    }
    setShowFileUpload(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {chatName}
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </CardTitle>
          <Badge variant="outline">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  {message.sender_avatar ? (
                    <AvatarImage src={message.sender_avatar} alt={message.sender_name} />
                  ) : (
                    <AvatarFallback>
                      {message.sender_name?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </span>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3 max-w-md">
                    {message.type === 'image' && message.file_url && (
                      <img 
                        src={message.file_url} 
                        alt={message.file_name || 'Image'} 
                        className="max-w-full h-auto rounded mb-2"
                      />
                    )}
                    
                    {message.type === 'file' && message.file_url && (
                      <div className="flex items-center gap-2 p-2 bg-background rounded border mb-2">
                        <Paperclip className="h-4 w-4" />
                        <a 
                          href={message.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {message.file_name}
                        </a>
                      </div>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <MessageReactionPicker
                    messageId={message.id}
                    reactions={[]}
                    onAddReaction={addReaction}
                    onRemoveReaction={removeReaction}
                  />
                </div>
              </div>
            ))}
            
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {showFileUpload && (
          <div className="border-t p-4">
            <FileUploadZone
              onFileUpload={handleFileUpload}
              onCancel={() => setShowFileUpload(false)}
            />
          </div>
        )}

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFileUpload(!showFileUpload)}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="min-h-[40px] max-h-[120px] resize-none pr-12"
              />
              <Button
                size="icon"
                className="absolute right-1 bottom-1 h-8 w-8"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
