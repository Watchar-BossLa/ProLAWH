
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { ProjectsHeader } from "./projects/ProjectsHeader";
import { ProjectsTabs } from "./projects/ProjectsTabs";
import { ProjectList } from "./projects/ProjectList";
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
        <ProjectList projects={filteredProjects} />
      </CardContent>
    </Card>
  );
}
