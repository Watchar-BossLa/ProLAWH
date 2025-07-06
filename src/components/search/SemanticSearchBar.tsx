
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Sparkles, Brain, Zap, X } from 'lucide-react';
import { useSemanticSearch } from '@/hooks/useSemanticSearch';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';

interface SemanticSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  context?: 'opportunities' | 'learning' | 'network' | 'mentorship';
  onResultsChange?: (results: any[]) => void;
  className?: string;
}

export function SemanticSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search with AI-powered understanding...",
  context,
  onResultsChange,
  className = ""
}: SemanticSearchBarProps) {
  const { isEnabled } = useFeatureFlags();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [semanticMode, setSemanticMode] = useState(false);
  
  const {
    isSearching,
    searchResults,
    searchInsights,
    performSemanticSearch,
    generateSearchSuggestions,
    clearSearch
  } = useSemanticSearch();

  // Generate suggestions as user types
  useEffect(() => {
    if (value.length > 2 && semanticMode) {
      const timeoutId = setTimeout(async () => {
        const suggestions = await generateSearchSuggestions(value, context);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, semanticMode, context]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    onSearch(query);
    setShowSuggestions(false);
    
    if (semanticMode && isEnabled('aiEnhancedSearch')) {
      // Perform semantic search with mock data
      const mockData = []; // This would be replaced with actual data
      await performSemanticSearch(mockData, { query, context });
      
      if (onResultsChange) {
        onResultsChange(searchResults);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    handleSearch(suggestion);
  };

  const toggleSemanticMode = () => {
    setSemanticMode(!semanticMode);
    if (!semanticMode) {
      clearSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className={`pl-10 pr-4 ${
              semanticMode ? 'ring-2 ring-blue-500 border-blue-300' : ''
            }`}
            disabled={isSearching}
          />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onChange('');
                clearSearch();
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {isEnabled('aiEnhancedSearch') && (
          <Button
            variant={semanticMode ? "default" : "outline"}
            onClick={toggleSemanticMode}
            className="flex items-center gap-2"
            disabled={isSearching}
          >
            {semanticMode ? (
              <>
                <Brain className="h-4 w-4" />
                AI Active
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Boost
              </>
            )}
          </Button>
        )}

        <Button
          onClick={() => handleSearch(value)}
          disabled={isSearching || !value.trim()}
          className="flex items-center gap-2"
        >
          {isSearching ? (
            <Zap className="h-4 w-4 animate-pulse" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Search
        </Button>
      </div>

      {/* Semantic Search Insights */}
      {semanticMode && searchInsights && (
        <Card className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-0">
            <div className="space-y-2">
              {searchInsights.queryInterpretation && (
                <div>
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    AI Understanding:
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {searchInsights.queryInterpretation}
                  </div>
                </div>
              )}
              
              {searchInsights.suggestedFilters.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Suggested Filters:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {searchInsights.suggestedFilters.map((filter, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {filter}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {searchInsights.relatedTopics.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Related Topics:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {searchInsights.relatedTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(topic)}
                        className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI-Generated Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                AI Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    {suggestion}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
