
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
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
  
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Text search filter
      if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filters
      if (activeTab === "climate" && project.impactArea !== "Climate") return false;
      if (activeTab === "conservation" && project.impactArea !== "Conservation") return false;
      if (activeTab === "community" && project.impactArea !== "Community") return false;
      if (activeTab === "insured" && !project.hasInsurance) return false;
      
      return true;
    });
  }, [projects, searchQuery, activeTab]);
  
  // Calculate counts for each tab
  const projectCounts = useMemo(() => {
    return {
      all: projects.length,
      climate: projects.filter(p => p.impactArea === "Climate").length,
      conservation: projects.filter(p => p.impactArea === "Conservation").length,
      community: projects.filter(p => p.impactArea === "Community").length,
      insured: projects.filter(p => p.hasInsurance).length,
    };
  }, [projects]);
  
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
          <ProjectsTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            projectCounts={projectCounts}
          />
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
