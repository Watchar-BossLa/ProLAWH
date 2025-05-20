
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  clearSearch: () => void;
  hasSearchResults: boolean;
  placeholder?: string;
}

export function SearchInput({ 
  onSearch, 
  searchQuery, 
  clearSearch, 
  hasSearchResults,
  placeholder = "Search messages..." 
}: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Force expanded state when there's an active search
  useEffect(() => {
    if (searchQuery && !isExpanded) {
      setIsExpanded(true);
    }
  }, [searchQuery]);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Close search on Escape key when input is empty
    if (e.key === 'Escape' && !searchQuery) {
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    if (isExpanded && searchQuery) {
      clearSearch();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2 relative">
      {isExpanded && (
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full pr-8 ${hasSearchResults ? 'border-primary' : ''}`}
            aria-label="Search input"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={handleClearSearch}
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <Button
        variant={isExpanded ? "default" : "ghost"}
        size="icon"
        onClick={toggleSearch}
        className="flex-shrink-0"
        title={isExpanded ? "Close search" : "Search messages"}
        aria-label={isExpanded ? "Close search" : "Search messages"}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
