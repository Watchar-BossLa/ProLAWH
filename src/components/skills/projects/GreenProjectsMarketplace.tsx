
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectsHeader } from "./ProjectsHeader";
import { ProjectsTabs } from "./ProjectsTabs";
import type { GreenProject } from "@/types/projects";

interface GreenProjectsMarketplaceProps {
  projects: GreenProject[];
}

export function GreenProjectsMarketplace({ projects }: GreenProjectsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredProjects = projects.filter(project => {
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (activeTab === "climate" && project.impactArea !== "Climate") return false;
    if (activeTab === "conservation" && project.impactArea !== "Conservation") return false;
    if (activeTab === "community" && project.impactArea !== "Community") return false;
    
    return true;
  });
  
  return (
    <Card>
      <CardHeader>
        <ProjectsHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <Tabs
          defaultValue="all"
          className="mt-2"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <ProjectsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-10">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No matching projects</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or filters to find more opportunities
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
