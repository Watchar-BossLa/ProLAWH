
import { useState, useRef, useEffect } from "react";
import { NetworkConnection, NetworkMessage } from "@/types/network";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, Paperclip, Image } from "lucide-react";

interface ChatInterfaceProps {
  connection: NetworkConnection;
  onClose: () => void;
}

export function ChatInterface({ connection, onClose }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<NetworkMessage[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for the chat history
  useEffect(() => {
    // Simulate fetching chat history
    const mockMessages: NetworkMessage[] = [
      {
        id: "1",
        senderId: "currentUser",
        receiverId: connection.id,
        content: "Hi there, wanted to connect about the project we discussed!",
        timestamp: "2025-04-25T14:30:00Z",
        read: true
      },
      {
        id: "2",
        senderId: connection.id,
        receiverId: "currentUser",
        content: "Hey! Good to hear from you. What aspects of the project did you want to discuss specifically?",
        timestamp: "2025-04-25T14:35:00Z",
        read: true
      },
      {
        id: "3",
        senderId: "currentUser",
        receiverId: connection.id,
        content: "I was thinking about the technical architecture. Do you have some time this week to go over it?",
        timestamp: "2025-04-25T14:40:00Z",
        read: true
      }
    ];
    
    setMessages(mockMessages);
  }, [connection.id]);
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    const newMessage: NetworkMessage = {
      id: `msg-${Date.now()}`,
      senderId: "currentUser",
      receiverId: connection.id,
      content: message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {connection.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h3 className="font-medium">{connection.name}</h3>
            <p className="text-xs text-muted-foreground">{connection.role} · {connection.company}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === "currentUser";
          return (
            <div 
              key={msg.id} 
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}
              >
                <p className="text-sm break-words">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t p-3 bg-muted/20">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" type="button" className="rounded-full">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={handleSendMessage} className="rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
