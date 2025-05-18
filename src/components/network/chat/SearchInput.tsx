
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  clearSearch: () => void;
  hasSearchResults: boolean;
}

export function SearchInput({ 
  onSearch, 
  searchQuery, 
  clearSearch, 
  hasSearchResults 
}: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const toggleSearch = () => {
    if (isExpanded && searchQuery) {
      clearSearch();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isExpanded && (
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search messages..."
            className={`w-full pr-8 ${hasSearchResults ? 'border-primary' : ''}`}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
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
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
