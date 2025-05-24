
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Search
} from 'lucide-react';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { MessageReactions } from './MessageReactions';
import { TypingIndicator } from './TypingIndicator';
import { FileUpload } from './FileUpload';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  reactions: Record<string, string[]>;
  thread_id?: string;
  reply_to?: string;
}

interface EnhancedChatInterfaceProps {
  connectionId: string;
  connectionName: string;
  connectionAvatar?: string;
  onClose?: () => void;
}

export function EnhancedChatInterface({
  connectionId,
  connectionName,
  connectionAvatar,
  onClose
}: EnhancedChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    sendTypingIndicator,
    uploadFile,
    addReaction,
    removeReaction,
    markAsRead,
    typingUsers,
    onlineStatus
  } = useRealtimeChat(connectionId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage({
      content: message,
      type: 'text',
      reply_to: replyToMessage?.id
    });

    setMessage('');
    setReplyToMessage(null);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true);
      
      setTimeout(() => {
        setIsTyping(false);
        sendTypingIndicator(false);
      }, 2000);
    }
  };

  const handleFileUpload = async (file: File) => {
    await uploadFile(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredMessages = messages.filter(msg =>
    !searchQuery || 
    msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={connectionAvatar} />
              <AvatarFallback>
                {connectionName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{connectionName}</CardTitle>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  onlineStatus === 'online' ? 'bg-green-500' : 
                  onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-muted-foreground capitalize">
                  {onlineStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
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
                ×
              </Button>
            )}
          </div>
        </div>
        
        {showSearch && (
          <div className="mt-3">
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="group">
                {msg.reply_to && (
                  <div className="text-xs text-muted-foreground mb-1 ml-12 pl-3 border-l-2 border-muted">
                    Replying to: {messages.find(m => m.id === msg.reply_to)?.content.substring(0, 50)}...
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={msg.sender_avatar} />
                    <AvatarFallback className="text-xs">
                      {msg.sender_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.sender_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-muted rounded-lg p-3">
                      {msg.type === 'text' && (
                        <p className="text-sm">{msg.content}</p>
                      )}
                      
                      {msg.type === 'file' && (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <a 
                            href={msg.file_url} 
                            download={msg.file_name}
                            className="text-sm text-primary hover:underline"
                          >
                            {msg.file_name}
                          </a>
                        </div>
                      )}
                      
                      {msg.type === 'image' && (
                        <img 
                          src={msg.file_url} 
                          alt={msg.file_name}
                          className="max-w-sm rounded-md"
                        />
                      )}
                    </div>
                    
                    <MessageReactions
                      message={msg}
                      onAddReaction={addReaction}
                      onRemoveReaction={removeReaction}
                    />
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyToMessage(msg)}
                        className="text-xs"
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {typingUsers.length > 0 && (
              <TypingIndicator users={typingUsers} />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {replyToMessage && (
          <div className="px-4 py-2 bg-muted/50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Replying to: {replyToMessage.content.substring(0, 50)}...
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyToMessage(null)}
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={handleKeyPress}
                className="resize-none"
              />
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
