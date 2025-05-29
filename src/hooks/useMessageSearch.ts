
import { useState, useMemo } from 'react';
import Fuse, { type FuseResult, type FuseResultMatch } from 'fuse.js';
import { ChatMessage, SearchFilters } from './chat/types';

export interface SearchResult {
  message: ChatMessage;
  score: number;
  matches: readonly FuseResultMatch[];
}

export type { SearchFilters };

export function useMessageSearch(messages: ChatMessage[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const fuse = useMemo(() => {
    return new Fuse(messages, {
      keys: [
        { name: 'content', weight: 2 },
        { name: 'sender_name', weight: 1 },
        { name: 'file_name', weight: 1 }
      ],
      includeScore: true,
      includeMatches: true,
      threshold: 0.3,
      minMatchCharLength: 2
    });
  }, [messages]);

  const searchResults = useMemo((): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const results = fuse.search(searchQuery);
    return results.map(result => ({
      message: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));
  }, [fuse, searchQuery]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    
    return messages.filter(message => {
      const contentMatch = message.content.toLowerCase().includes(searchQuery.toLowerCase());
      const senderMatch = message.sender_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const fileMatch = message.file_name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return contentMatch || senderMatch || fileMatch;
    });
  }, [messages, searchQuery]);

  const highlightedMessageIds = useMemo(() => {
    return searchResults.map(result => result.message.id);
  }, [searchResults]);

  const getMessageContext = (messageId: string, contextSize: number = 2) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return [];
    
    const start = Math.max(0, messageIndex - contextSize);
    const end = Math.min(messages.length, messageIndex + contextSize + 1);
    
    return messages.slice(start, end);
  };

  const searchInTimeRange = (startDate: Date, endDate: Date) => {
    return messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      return messageDate >= startDate && messageDate <= endDate;
    });
  };

  const searchByMessageType = (messageType: 'text' | 'file' | 'image') => {
    return messages.filter(message => message.type === messageType);
  };

  const searchByUser = (userId: string) => {
    return messages.filter(message => message.sender_id === userId);
  };

  const searchWithReplyContext = () => {
    return messages.filter(message => message.reply_to);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    filteredMessages,
    highlightedMessageIds,
    getMessageContext,
    searchInTimeRange,
    searchByMessageType,
    searchByUser,
    searchWithReplyContext,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length
  };
}
