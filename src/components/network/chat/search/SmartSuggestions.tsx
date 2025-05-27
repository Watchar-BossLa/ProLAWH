
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Sparkles, Search } from "lucide-react";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface SmartSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (query: string) => void;
  className?: string;
}

export function SmartSuggestions({ suggestions, onSuggestionClick, className = "" }: SmartSuggestionsProps) {
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-4 w-4" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4" />;
      case 'contextual':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'popular':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'contextual':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  // Group suggestions by type
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.type]) {
      acc[suggestion.type] = [];
    }
    acc[suggestion.type].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  return (
    <div className={`space-y-4 ${className}`}>
      {Object.entries(groupedSuggestions).map(([type, typeSuggestions]) => (
        <div key={type} className="space-y-2">
          <div className="flex items-center gap-2">
            {getSuggestionIcon(type as SearchSuggestion['type'])}
            <h4 className="text-sm font-medium capitalize">
              {type === 'contextual' ? 'Smart' : type} Suggestions
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {typeSuggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="ghost"
                size="sm"
                onClick={() => onSuggestionClick(suggestion.query)}
                className={`h-auto p-2 ${getSuggestionColor(suggestion.type)}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{suggestion.query}</span>
                  {suggestion.description && (
                    <Badge variant="secondary" className="text-xs ml-1">
                      {suggestion.description}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
