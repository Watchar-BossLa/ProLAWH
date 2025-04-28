
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Globe } from "lucide-react";

interface ProjectsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ProjectsHeader({ searchQuery, onSearchChange }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
      <div>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Sustainability Projects
        </CardTitle>
        <CardDescription>
          Collaborate on real-world projects and make an environmental impact
        </CardDescription>
      </div>
      
      <div className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 w-[200px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
