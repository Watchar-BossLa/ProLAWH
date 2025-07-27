
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface ProjectsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  projectCounts?: {
    all: number;
    climate: number;
    conservation: number;
    community: number;
    insured: number;
  };
}

export function ProjectsTabs({ 
  activeTab, 
  onTabChange, 
  projectCounts = { all: 0, climate: 0, conservation: 0, community: 0, insured: 0 } 
}: ProjectsTabsProps) {
  return (
    <TabsList className="grid grid-cols-5 w-full md:w-[500px]">
      <TabsTrigger value="all" onClick={() => onTabChange("all")}>
        All
        {projectCounts.all > 0 && (
          <Badge variant="secondary" className="ml-2">
            {projectCounts.all}
          </Badge>
        )}
      </TabsTrigger>
      
      <TabsTrigger value="climate" onClick={() => onTabChange("climate")}>
        Climate
        {projectCounts.climate > 0 && (
          <Badge variant="secondary" className="ml-2">
            {projectCounts.climate}
          </Badge>
        )}
      </TabsTrigger>
      
      <TabsTrigger value="conservation" onClick={() => onTabChange("conservation")}>
        Conservation
        {projectCounts.conservation > 0 && (
          <Badge variant="secondary" className="ml-2">
            {projectCounts.conservation}
          </Badge>
        )}
      </TabsTrigger>
      
      <TabsTrigger value="community" onClick={() => onTabChange("community")}>
        Community
        {projectCounts.community > 0 && (
          <Badge variant="secondary" className="ml-2">
            {projectCounts.community}
          </Badge>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="insured" 
        onClick={() => onTabChange("insured")}
        className="flex items-center gap-1"
      >
        <Shield className="h-4 w-4 mr-1" />
        Insured
        {projectCounts.insured > 0 && (
          <Badge variant="secondary">
            {projectCounts.insured}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
}
