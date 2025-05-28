import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, User, FileText, Image, Paperclip } from "lucide-react";
import { SearchResult } from "@/hooks/useMessageSearch";
import { format } from "date-fns";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading?: boolean;
  totalResults: number;
  onSelectMessage: (messageId: string) => void;
  onClearSearch: () => void;
}

export function SearchResults({
  results,
  query,
  isLoading,
  totalResults,
  onSelectMessage,
  onClearSearch
}: SearchResultsProps) {
  const highlightMatch = (text: string, matches: readonly any[]) => {
    if (!matches || matches.length === 0) return text;
    
    // Convert readonly array to mutable array for processing
    const mutableMatches = [...matches];
    
    let highlightedText = text;
    const highlights: Array<{ start: number; end: number }> = [];
    
    mutableMatches.forEach((match) => {
      if (match.indices) {
        match.indices.forEach(([start, end]: [number, number]) => {
          highlights.push({ start, end: end + 1 });
        });
      }
    });
    
    // Sort highlights by start position (descending) to avoid offset issues
    highlights.sort((a, b) => b.start - a.start);
    
    highlights.forEach(({ start, end }) => {
      const before = highlightedText.slice(0, start);
      const highlight = highlightedText.slice(start, end);
      const after = highlightedText.slice(end);
      highlightedText = `${before}<mark class="bg-yellow-200 dark:bg-yellow-800/70 px-0.5 rounded-sm">${highlight}</mark>${after}`;
    });
    
    return highlightedText;
  };

  const getPreviewWithContext = (content: string, matches: readonly any[], maxLength: number = 150) => {
    if (!matches || matches.length === 0) {
      return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
    }
    
    // Convert readonly array to mutable array
    const mutableMatches = [...matches];
    
    // Find the first match to center the preview around it
    const firstMatch = mutableMatches[0];
    if (!firstMatch?.indices?.[0]) {
      return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
    }
    
    const [matchStart] = firstMatch.indices[0];
    const contextStart = Math.max(0, matchStart - Math.floor(maxLength / 2));
    const contextEnd = Math.min(content.length, contextStart + maxLength);
    
    let preview = content.slice(contextStart, contextEnd);
    if (contextStart > 0) preview = `...${preview}`;
    if (contextEnd < content.length) preview = `${preview}...`;
    
    return preview;
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'file':
        return <Paperclip className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch {
      return 'Invalid time';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No messages found</h3>
        <p className="text-muted-foreground">
          {query ? `No messages match "${query}"` : 'Try searching for something specific'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </h3>
        {query && (
          <Badge variant="secondary" className="text-xs">
            "{query}"
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {results.map((result) => {
          const message = result.message;
          
          return (
            <Card 
              key={message.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectMessage(message.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    {message.sender_avatar ? (
                      <AvatarImage src={message.sender_avatar} />
                    ) : (
                      <AvatarFallback>
                        {message.sender_name?.substring(0, 2)?.toUpperCase() || '??'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {message.sender_name || 'Unknown User'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getMessageTypeIcon(message.type)}
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(message.timestamp)}</span>
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      {message.type === 'text' ? (
                        <p className="line-clamp-2">
                          {highlightMatch(message.content, result.matches)}
                        </p>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {getMessageTypeIcon(message.type)}
                          <span>
                            {message.type === 'image' ? 'Image: ' : 'File: '}
                            {highlightMatch(message.file_name || 'Attachment', result.matches)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Reactions count */}
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {Object.entries(message.reactions).map(([emoji, users]) => {
                          const userArray = Array.isArray(users) ? users : [];
                          if (userArray.length === 0) return null;
                          
                          return (
                            <Badge key={emoji} variant="outline" className="text-xs px-1 py-0">
                              {emoji} {userArray.length}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Match score indicator */}
                    {result.score < 0.8 && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round((1 - result.score) * 100)}% match
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMessage(message.id);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
