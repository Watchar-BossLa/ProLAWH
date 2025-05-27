
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageAttachment } from "../MessageAttachment";
import { SearchResult } from "@/hooks/useMessageSearch";
import { Search, MessageSquare } from "lucide-react";

interface SearchResultsProps {
  results: SearchResult[];
  onMessageClick?: (messageId: string) => void;
  className?: string;
}

export function SearchResults({ results, onMessageClick, className = "" }: SearchResultsProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
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

  const highlightMatches = (text: string, matches: Array<{ indices: [number, number][] }>) => {
    if (!matches || matches.length === 0) return text;

    const allIndices: [number, number][] = [];
    matches.forEach(match => {
      match.indices.forEach(([start, end]) => {
        allIndices.push([start, end]);
      });
    });

    // Sort indices by start position
    allIndices.sort((a, b) => a[0] - b[0]);

    // Merge overlapping indices
    const mergedIndices: [number, number][] = [];
    for (const [start, end] of allIndices) {
      if (mergedIndices.length === 0 || mergedIndices[mergedIndices.length - 1][1] < start) {
        mergedIndices.push([start, end]);
      } else {
        mergedIndices[mergedIndices.length - 1][1] = Math.max(mergedIndices[mergedIndices.length - 1][1], end);
      }
    }

    // Build highlighted text
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    mergedIndices.forEach(([start, end], index) => {
      // Add text before match
      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start));
      }
      
      // Add highlighted match
      parts.push(
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800/70 px-0.5 rounded-sm">
          {text.slice(start, end + 1)}
        </mark>
      );
      
      lastIndex = end + 1;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  };

  if (results.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 text-muted-foreground ${className}`}>
        <Search className="h-12 w-12 mb-2 opacity-50" />
        <p>No messages found</p>
        <p className="text-sm">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-sm text-muted-foreground mb-4">
        Showing {results.length} result{results.length !== 1 ? 's' : ''}
      </div>
      
      {results.map((result, index) => {
        const { message, matches } = result;
        const contentMatches = matches.filter(m => m.key === 'content');
        
        return (
          <div
            key={`${message.id}-${index}`}
            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => onMessageClick?.(message.id)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                {message.sender_avatar ? (
                  <AvatarImage src={message.sender_avatar} alt={message.sender_name} />
                ) : (
                  <AvatarFallback>
                    {message.sender_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.sender_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(message.timestamp)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.reply_to && (
                    <Badge variant="secondary" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reply
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  {message.content && (
                    <p className="text-sm break-words">
                      {highlightMatches(message.content, contentMatches)}
                    </p>
                  )}
                  
                  {message.file_url && (
                    <MessageAttachment
                      attachment={{
                        id: message.id,
                        type: message.type as any,
                        url: message.file_url,
                        name: message.file_name || 'File'
                      }}
                      compact
                    />
                  )}
                  
                  {Object.keys(message.reactions || {}).length > 0 && (
                    <div className="flex gap-1">
                      {Object.entries(message.reactions || {}).map(([emoji, userIds]) => (
                        userIds.length > 0 && (
                          <Badge key={emoji} variant="secondary" className="text-xs">
                            {emoji} {userIds.length}
                          </Badge>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
