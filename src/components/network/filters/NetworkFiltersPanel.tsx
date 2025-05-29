
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, UserRound, Network, RefreshCcw } from "lucide-react";
import { NetworkIndustrySelector } from "../NetworkIndustrySelector";

interface NetworkFiltersPanelProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  industries: string[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
  connectionStats: {
    mentors: number;
    peers: number;
    colleagues: number;
  };
}

export function NetworkFiltersPanel({
  activeFilter,
  onFilterChange,
  industries,
  selectedIndustry,
  onSelectIndustry,
  connectionStats
}: NetworkFiltersPanelProps) {
  const filters = [
    { id: "all", label: "All Connections", icon: Users },
    { id: "mentor", label: "Mentors", icon: UserRound },
    { id: "peer", label: "Peers", icon: Network },
    { id: "colleague", label: "Colleagues", icon: Briefcase },
  ];

  const handleReset = () => {
    onFilterChange("all");
    onSelectIndustry(null);
  };

  const getFilterCount = (filterId: string) => {
    switch (filterId) {
      case "mentor": return connectionStats.mentors;
      case "peer": return connectionStats.peers;
      case "colleague": return connectionStats.colleagues;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => {
            const count = getFilterCount(filter.id);
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => onFilterChange(filter.id)}
                className="transition-all"
              >
                <filter.icon className="h-4 w-4 mr-2" />
                {filter.label}
                {count !== null && (
                  <Badge variant="secondary" className="ml-2">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <NetworkIndustrySelector
            industries={industries}
            selectedIndustry={selectedIndustry}
            onSelectIndustry={onSelectIndustry}
          />
          
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
