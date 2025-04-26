
import { Button } from "@/components/ui/button";

interface NetworkFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function NetworkFilters({ activeFilter, onFilterChange }: NetworkFiltersProps) {
  const filters = [
    { id: "all", label: "All Connections" },
    { id: "mentor", label: "Mentors" },
    { id: "peer", label: "Peers" },
    { id: "colleague", label: "Colleagues" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          onClick={() => onFilterChange(filter.id)}
          className="transition-all"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
