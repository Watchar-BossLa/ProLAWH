
import { useState, useRef, useEffect } from "react";
import { NetworkConnection } from "@/types/network";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, Paperclip } from "lucide-react";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { usePresenceStatus } from "@/hooks/usePresenceStatus";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChatInterfaceProps {
  connection: NetworkConnection;
  onClose: () => void;
}

export function ChatInterface({ connection, onClose }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Use the corrected hook with proper recipient ID
  const { 
    messages, 
    isLoading, 
    sendMessage 
  } = useRealtimeChat(connection.id);
  
  const { getUserStatus, updateTypingStatus, isUserTypingTo } = usePresenceStatus();
  const connectionStatus = getUserStatus(connection.id);
  const isRecipientTyping = user ? isUserTypingTo(connection.id, user.id) : false;
  
  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;
    
    // Disable typing indicator
    updateTypingStatus(false);
    
    // Send message with correct parameters
    try {
      await sendMessage({
        content: message,
        sender_id: user.id,
        receiver_id: connection.id
      });
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Update typing status when the user starts typing
    if (e.target.value.trim() !== '' && user && connection.id) {
      updateTypingStatus(true, connection.id);
    } else {
      updateTypingStatus(false);
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [date: string]: any[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-card overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9 relative">
            {connection.avatar ? (
              <AvatarImage src={connection.avatar} alt={connection.name} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {connection.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
            <div 
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                connectionStatus.status === 'online' ? 'bg-green-500' : 
                connectionStatus.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}
            />
          </Avatar>
          <div>
            <h3 className="font-medium">{connection.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{connection.role} · {connection.company}</span>
              <span className="inline-flex w-1 h-1 bg-muted-foreground rounded-full mx-1"></span>
              <span className={
                connectionStatus.status === 'online' ? 'text-green-500' : 
                connectionStatus.status === 'away' ? 'text-yellow-500' : 'text-gray-400'
              }>
                {connectionStatus.status}
              </span>
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date} className="mb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDate(date)}
                </div>
              </div>
              
              {dateMessages.map((msg) => {
                const isCurrentUser = user && msg.sender_id === user.id;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-3`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        {connection.avatar ? (
                          <AvatarImage src={connection.avatar} alt={connection.name} />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {connection.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Avatar className="h-8 w-8 ml-2 mt-1">
                        <AvatarFallback>Me</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        {isRecipientTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>
      
      {/* Message input */}
      <div className="border-t p-3 bg-muted/20">
        <div className="flex items-end gap-2">
          <Textarea 
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" type="button" className="rounded-full">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage} 
              className="rounded-full"
              disabled={isLoading || message.trim() === ''}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
