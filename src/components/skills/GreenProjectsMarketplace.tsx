
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface GreenProject {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string[];
  teamSize: number;
  duration: string;
  category: string;
  impactArea: string;
  location?: string;
  deadline?: string;
  carbonReduction?: number;
  sdgAlignment?: number[];
  compensation?: string;
  hasInsurance?: boolean;
}

interface GreenProjectsMarketplaceProps {
  projects: GreenProject[];
}

export function GreenProjectsMarketplace({ projects }: GreenProjectsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
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
    
    return true;
  });
  
  const handleApply = (projectId: string) => {
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully"
    });
  };
  
  return (
    <Card>
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
          <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="climate">Climate</TabsTrigger>
            <TabsTrigger value="conservation">Conservation</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Card key={project.id} className="bg-muted/40 hover:bg-muted/60 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{project.title}</h3>
                      <Badge variant={
                        project.impactArea === "Climate" ? "default" :
                        project.impactArea === "Conservation" ? "secondary" : "outline"
                      }>
                        {project.impactArea}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-muted-foreground">{project.teamSize} members</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-muted-foreground">{project.duration}</span>
                      </div>
                      
                      {project.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-muted-foreground">{project.location}</span>
                        </div>
                      )}
                      
                      {project.compensation && (
                        <div className="flex items-center gap-1">
                          <Leaf className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-muted-foreground">{project.compensation}</span>
                        </div>
                      )}
                      
                      {project.hasInsurance && (
                        <div className="flex items-center gap-1 col-span-2">
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                          <span className="text-muted-foreground">Project includes gig insurance</span>
                        </div>
                      )}
                      
                      {project.carbonReduction && (
                        <div className="flex items-center gap-1 col-span-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {project.carbonReduction}kg CO2 reduction
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.skillsNeeded.slice(0, 3).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skillsNeeded.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skillsNeeded.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button className="flex-1" onClick={() => handleApply(project.id)}>
                        Apply Now <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
