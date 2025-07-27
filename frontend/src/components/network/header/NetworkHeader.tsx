
import { Search, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NetworkHeaderProps {
  isSearchExpanded: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchToggle: () => void;
}

export function NetworkHeader({ 
  isSearchExpanded, 
  searchQuery, 
  onSearchChange,
  onSearchToggle 
}: NetworkHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Professional Network</h2>
        <p className="text-muted-foreground">
          Connect, collaborate, and grow with other professionals
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {isSearchExpanded ? (
          <div className="flex gap-2 items-center animate-fade-in">
            <Input
              placeholder="Search network..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64"
              autoFocus
            />
            <Button variant="ghost" onClick={onSearchToggle}>
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={onSearchToggle}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="default">
              <UserRound className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
