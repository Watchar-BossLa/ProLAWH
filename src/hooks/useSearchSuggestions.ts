import { useState, useEffect, useMemo } from 'react';
import { ChatMessage } from '@/hooks/useRealTimeChat';

export interface SearchSuggestion {
  id: string;
  type: 'recent' | 'popular' | 'contextual';
  query: string;
  description?: string;
  score: number;
}

export function useSearchSuggestions(messages: ChatMessage[], currentQuery: string = '') {
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  // Extract popular terms from messages
  const popularTerms = useMemo(() => {
    const termFrequency: Record<string, number> = {};
    
    messages.forEach(message => {
      const words = message.content
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3 && !word.match(/^(the|and|for|are|but|not|you|all|can|had|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|way|who|boy|did|its|let|put|say|she|too|use)$/));
      
      words.forEach(word => {
        termFrequency[word] = (termFrequency[word] || 0) + 1;
      });
    });

    return Object.entries(termFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term]) => term);
  }, [messages]);

  // Generate contextual suggestions based on current query
  const contextualSuggestions = useMemo(() => {
    if (!currentQuery.trim()) return [];

    const suggestions: string[] = [];
    const queryLower = currentQuery.toLowerCase();

    // Add sender-based suggestions
    const senders = [...new Set(messages.map(m => m.sender_name))];
    senders.forEach(sender => {
      if (sender.toLowerCase().includes(queryLower)) {
        suggestions.push(`from:${sender}`);
      }
    });

    // Add file type suggestions
    if (queryLower.includes('file') || queryLower.includes('document')) {
      suggestions.push('type:file', 'type:image', 'type:document');
    }

    // Add date suggestions
    if (queryLower.includes('today') || queryLower.includes('yesterday')) {
      suggestions.push('today', 'yesterday', 'this week');
    }

    return suggestions.slice(0, 5);
  }, [currentQuery, messages]);

  const suggestions = useMemo((): SearchSuggestion[] => {
    const allSuggestions: SearchSuggestion[] = [];

    // Recent queries
    recentQueries.slice(0, 3).forEach((query, index) => {
      allSuggestions.push({
        id: `recent-${index}`,
        type: 'recent',
        query,
        description: 'Recent search',
        score: 1.0 - (index * 0.1)
      });
    });

    // Popular terms
    popularTerms.slice(0, 5).forEach((term, index) => {
      allSuggestions.push({
        id: `popular-${index}`,
        type: 'popular',
        query: term,
        description: 'Popular term',
        score: 0.8 - (index * 0.1)
      });
    });

    // Contextual suggestions
    contextualSuggestions.forEach((suggestion, index) => {
      allSuggestions.push({
        id: `contextual-${index}`,
        type: 'contextual',
        query: suggestion,
        description: 'Smart suggestion',
        score: 0.9 - (index * 0.05)
      });
    });

    return allSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [recentQueries, popularTerms, contextualSuggestions]);

  const addRecentQuery = (query: string) => {
    if (!query.trim()) return;
    
    setRecentQueries(prev => {
      const filtered = prev.filter(q => q !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  useEffect(() => {
    // Load recent queries from localStorage
    const stored = localStorage.getItem('message-search-recent');
    if (stored) {
      try {
        setRecentQueries(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse stored recent queries');
      }
    }
  }, []);

  useEffect(() => {
    // Save recent queries to localStorage
    localStorage.setItem('message-search-recent', JSON.stringify(recentQueries));
  }, [recentQueries]);

  return {
    suggestions,
    addRecentQuery,
    clearRecentQueries: () => setRecentQueries([])
  };
}
