
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, X, Filter, Clock, TrendingUp, Sparkles } from "lucide-react";
import { SearchFilters } from "./SearchFilters";
import { SmartSuggestions } from "./SmartSuggestions";
import { SearchFilters as SearchFiltersType } from "@/hooks/useMessageSearch";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFiltersType;
  onFiltersChange: (filters: Partial<SearchFiltersType>) => void;
  suggestions: SearchSuggestion[];
  onSuggestionSelect: (suggestion: string) => void;
  onClear: () => void;
  totalResults?: number;
  isActive: boolean;
}

export function SearchInterface({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  suggestions,
  onSuggestionSelect,
  onClear,
  totalResults,
  isActive
}: SearchInterfaceProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock className="h-3 w-3" />;
      case 'popular':
        return <TrendingUp className="h-3 w-3" />;
      case 'contextual':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <Search className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search messages..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={activeFiltersCount > 0 ? "bg-primary/10" : ""}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <SearchFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClose={() => setShowFilters(false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search suggestions */}
      {showSuggestions && !isActive && suggestions.length > 0 && (
        <div className="bg-background border rounded-md shadow-md p-2 space-y-1">
          <div className="text-xs text-muted-foreground font-medium px-2 py-1">
            Suggestions
          </div>
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              variant="ghost"
              size="sm"
              onClick={() => {
                onSuggestionSelect(suggestion.query);
                setShowSuggestions(false);
              }}
              className="w-full justify-start text-left h-auto p-2"
            >
              <div className="flex items-center gap-2 w-full">
                {getSuggestionIcon(suggestion.type)}
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm">{suggestion.query}</div>
                  {suggestion.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Results summary */}
      {isActive && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {totalResults !== undefined && (
              <>
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
                {query && ` for "${query}"`}
              </>
            )}
          </span>
          {activeFiltersCount > 0 && (
            <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active</span>
          )}
        </div>
      )}
    </div>
  );
}
