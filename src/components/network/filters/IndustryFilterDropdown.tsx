
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface IndustryFilterDropdownProps {
  industries: string[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string | null) => void;
}

export function IndustryFilterDropdown({ 
  industries,
  selectedIndustry,
  onSelectIndustry
}: IndustryFilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Tag size={16} />
          <span>Industry/Sector</span>
          {selectedIndustry && (
            <Badge variant="secondary" className="ml-1">
              {selectedIndustry}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select Industry</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onSelectIndustry(null)}>
          All Industries
        </DropdownMenuItem>
        {industries.map((industry) => (
          <DropdownMenuItem
            key={industry}
            onClick={() => onSelectIndustry(industry)}
          >
            {industry}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
