
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkConnection } from "@/types/network";
import { Sparkles, Loader2, SearchX } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  connection: NetworkConnection;
  formatDate: (timestamp: string) => string;
  formatTime: (timestamp: string) => string;
  suggestedTopics: string[];
  isGeneratingTopics: boolean;
  useSuggestedTopic: (topic: string) => void;
  isSearchActive?: boolean;
}

// Helper function to highlight search terms
function highlightSearchTerm(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm) return text;
  
  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === searchTerm.toLowerCase() 
      ? <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark> 
      : part
  );
}

export function SmartMessageList({
  messages,
  messagesEndRef,
  connection,
  formatDate,
  formatTime,
  suggestedTopics,
  isGeneratingTopics,
  useSuggestedTopic,
  isSearchActive
}: MessageListProps) {
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 && isSearchActive && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <SearchX className="h-12 w-12 mb-2 opacity-50" />
          <p>No messages found</p>
        </div>
      )}
      
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-4">
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="text-xs font-normal">
              {date}
            </Badge>
          </div>
          
          {dateMessages.map((message) => (
            <div 
              key={message.id} 
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'contact' && (
                <Avatar className="h-8 w-8 mr-2">
                  {connection.avatar ? (
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                  ) : (
                    <AvatarFallback>
                      {connection.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-accent'
                }`}
              >
                <p className="break-words">
                  {isSearchActive 
                    ? highlightSearchTerm(message.content, window.location.search.replace('?q=', '')) 
                    : message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 ml-2">
                  <AvatarFallback>Me</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />

      {suggestedTopics.length > 0 && !isSearchActive && (
        <div className="mb-2">
          <div className="flex items-center mb-2">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span className="text-xs font-medium">Suggested conversation starters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((topic, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="cursor-pointer text-xs py-1 hover:bg-secondary/80"
                onClick={() => useSuggestedTopic(topic)}
              >
                {topic}
              </Badge>
            ))}
            {isGeneratingTopics && (
              <Badge variant="outline" className="text-xs animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
