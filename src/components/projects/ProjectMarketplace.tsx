
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Users, Globe, Search, Filter, MapPin, Calendar, Leaf, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { ProjectCard } from "./ProjectCard";
import { useAuth } from "@/hooks/useAuth";

export function ProjectMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { projects, isLoading, hasUserApplied, userApplications } = useProjectMarketplace();
  const { user } = useAuth();
  
  const filteredProjects = projects.filter(project => {
    // Filter by search query
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === "climate" && project.impactArea !== "Climate") return false;
    if (activeTab === "conservation" && project.impactArea !== "Conservation") return false;
    if (activeTab === "community" && project.impactArea !== "Community") return false;
    if (activeTab === "insured" && !project.hasInsurance) return false;
    
    return true;
  });
  
  // Calculate counts for each tab
  const projectCounts = {
    all: projects.length,
    climate: projects.filter(p => p.impactArea === "Climate").length,
    conservation: projects.filter(p => p.impactArea === "Conservation").length,
    community: projects.filter(p => p.impactArea === "Community").length,
    insured: projects.filter(p => p.hasInsurance).length,
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Tabs
          defaultValue="all"
          className="mt-2"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-5 w-full md:w-[500px]">
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {projectCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="climate">
              Climate
              <Badge variant="secondary" className="ml-2">
                {projectCounts.climate}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="conservation">
              Conservation
              <Badge variant="secondary" className="ml-2">
                {projectCounts.conservation}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="community">
              Community
              <Badge variant="secondary" className="ml-2">
                {projectCounts.community}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="insured" className="flex items-center gap-1">
              <Shield className="h-4 w-4 mr-1" />
              Insured
              <Badge variant="secondary">
                {projectCounts.insured}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project}
                  hasApplied={hasUserApplied(project.id)}
                  isOwnProject={user?.id === project.createdBy}
                />
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
