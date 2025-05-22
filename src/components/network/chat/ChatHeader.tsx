
import React from "react";
import { NetworkConnection } from "@/types/network";
import { NetworkConnectionStatus } from "../cards/NetworkConnectionStatus";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SearchInput } from "./SearchInput";

interface ChatHeaderProps {
  connection: NetworkConnection;
  onClose: () => void;
  searchQuery?: string;
  onSearch?: (query: string) => void;
  clearSearch?: () => void;
  hasSearchResults?: boolean;
}

export function ChatHeader({ 
  connection, 
  onClose, 
  searchQuery = "", 
  onSearch, 
  clearSearch,
  hasSearchResults = false
}: ChatHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="font-semibold">{connection.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-semibold">{connection.name}</h3>
          <div className="flex items-center text-xs text-muted-foreground">
            <NetworkConnectionStatus userId={connection.id} showLabel />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onSearch && clearSearch && (
          <SearchInput 
            onSearch={onSearch}
            searchQuery={searchQuery}
            clearSearch={clearSearch}
            hasSearchResults={hasSearchResults}
            placeholder="Search messages..."
          />
        )}
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
