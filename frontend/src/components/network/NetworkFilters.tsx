
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Filter, Users, Briefcase, UserRound, Network, RefreshCcw } from "lucide-react";
import { useState } from "react";

interface NetworkFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function NetworkFilters({ activeFilter, onFilterChange }: NetworkFiltersProps) {
  const [activeSort, setActiveSort] = useState<string>("recent");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  
  const filters = [
    { id: "all", label: "All Connections", icon: Users },
    { id: "mentor", label: "Mentors", icon: UserRound },
    { id: "peer", label: "Peers", icon: Network },
    { id: "colleague", label: "Colleagues", icon: Briefcase },
  ];
  
  const handleReset = () => {
    onFilterChange("all");
    setActiveSort("recent");
    setActiveStatus("all");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => onFilterChange(filter.id)}
              className="transition-all"
            >
              <filter.icon className="h-4 w-4 mr-2" />
              {filter.label}
              {filter.id !== "all" && (
                <Badge variant="secondary" className="ml-2">
                  {filter.id === "mentor" ? 12 : filter.id === "peer" ? 89 : 41}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Sort & Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={activeSort} onValueChange={setActiveSort}>
                <DropdownMenuRadioItem value="recent">Most Recent</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="strength">Connection Strength</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alphabetical">Alphabetical</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="company">Company</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={activeStatus} onValueChange={setActiveStatus}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="online">Online</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unread">Unread Messages</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">Pending Requests</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
