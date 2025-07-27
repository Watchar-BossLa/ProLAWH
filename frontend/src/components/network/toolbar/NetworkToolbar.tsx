
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { IndustryFilterDropdown } from "@/components/network/filters/IndustryFilterDropdown";

interface NetworkToolbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  industries: string[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
}

export function NetworkToolbar({
  activeFilter,
  onFilterChange,
  industries,
  selectedIndustry,
  onSelectIndustry
}: NetworkToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <NetworkFilters 
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
      
      <div className="flex gap-2">
        <IndustryFilterDropdown
          industries={industries}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={onSelectIndustry}
        />
      </div>
    </div>
  );
}
