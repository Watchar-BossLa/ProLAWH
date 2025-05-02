
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NetworkIndustrySelectorProps {
  industries: string[];
  selectedIndustry: string | null;
  onIndustryChange: (industry: string | null) => void;
}

export function NetworkIndustrySelector({ 
  industries, 
  selectedIndustry, 
  onIndustryChange 
}: NetworkIndustrySelectorProps) {
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
        <DropdownMenuItem onClick={() => onIndustryChange(null)}>
          All Industries
        </DropdownMenuItem>
        {industries.map((industry) => (
          <DropdownMenuItem
            key={industry}
            onClick={() => onIndustryChange(industry)}
          >
            {industry}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
