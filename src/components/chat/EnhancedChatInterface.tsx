
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
import { useRealTimeChat } from "@/hooks/useRealTimeChat";
import { useAdvancedSearch } from "@/hooks/chat/useAdvancedSearch";
import { MessageReactionPicker } from './MessageReactionPicker';
import { TypingIndicator } from './TypingIndicator';
import { FileUploadZone } from './FileUpload';
import { SearchInterface } from './SearchInterface';

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
  const [showSearch, setShowSearch] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    uploadFile,
    addReaction,
    removeReaction,
    typingUsers,
    onlineStatus
  } = useRealTimeChat(connectionId);

  const {
    query: searchQuery,
    filters,
    searchResults,
    suggestions,
    highlightedMessages,
    isSearchActive,
    hasResults,
    totalResults,
    updateQuery,
    updateFilters,
    clearSearch
  } = useAdvancedSearch({ 
    messages,
    onSearch: (query) => console.log('Search:', query)
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage({ content: message, type: 'text' });
    setMessage('');
    setReplyToMessage(null);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
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
    }
    setShowFileUpload(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = isSearchActive ? highlightedMessages : messages;
  const isConnected = onlineStatus === 'online';

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
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className={showSearch ? 'bg-muted' : ''}
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
            <SearchInterface
              query={searchQuery}
              onQueryChange={updateQuery}
              filters={filters}
              onFiltersChange={updateFilters}
              suggestions={suggestions}
              onSuggestionSelect={updateQuery}
              onClear={clearSearch}
              totalResults={totalResults}
              isActive={isSearchActive}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {showFileUpload && (
          <div className="border-b p-4">
            <FileUploadZone
              onFileUpload={handleFileUpload}
              onCancel={() => setShowFileUpload(false)}
            />
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {displayMessages.map((msg) => (
              <div key={msg.id} className="group">
                {msg.reply_to_id && (
                  <div className="text-xs text-muted-foreground mb-1 ml-12 pl-3 border-l-2 border-muted">
                    Replying to: {messages.find(m => m.id === msg.reply_to_id)?.content.substring(0, 50)}...
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={msg.sender_avatar} />
                    <AvatarFallback className="text-xs">
                      {msg.sender_name?.split(' ').map(n => n[0]).join('') || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.sender_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                      {isSearchActive && (
                        <Badge variant="outline" className="text-xs">
                          Match
                        </Badge>
                      )}
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
                    
                    <MessageReactionPicker
                      messageId={msg.id}
                      reactions={[]}
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
            
            <TypingIndicator typingUsers={typingUsers} />
            
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
                if (file) handleFileUpload([file]);
              }}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={showFileUpload ? 'bg-muted' : ''}
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
