
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, History, TrendingUp, Filter } from 'lucide-react';
import { searchService } from '@/services/searchService';

interface AdvancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  className?: string;
}

export function AdvancedSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search opportunities...",
  showFilters = true,
  onFiltersClick,
  className = ""
}: AdvancedSearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentSearches(searchService.getRecentSearches());
    setPopularSearches(searchService.getPopularSearches());
  }, []);

  useEffect(() => {
    if (value.trim().length > 1) {
      const newSuggestions = searchService.getSuggestions(value);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query || value;
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      setRecentSearches(searchService.getRecentSearches());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding to allow suggestion clicks
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            className="pl-10 pr-10"
          />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Button onClick={() => handleSearch()} variant="default">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>

        {showFilters && (
          <Button onClick={onFiltersClick} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {/* Query-based suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center gap-2"
                >
                  <Search className="h-3 w-3 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {!value.trim() && recentSearches.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center gap-1">
                <History className="h-3 w-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center gap-2"
                >
                  <History className="h-3 w-3 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Popular searches */}
          {!value.trim() && popularSearches.length > 0 && (
            <div className="p-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular Searches
              </div>
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded flex items-center gap-2"
                >
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
