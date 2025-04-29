
import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProjectMarketplace } from "@/components/projects/ProjectMarketplace";
import { CreateProjectForm } from "@/components/projects/CreateProjectForm";

export default function ProjectsMarketplacePage() {
  const [activeTab, setActiveTab] = useState("browse");
  
  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Green Project Marketplace</h1>
        <p className="text-muted-foreground">
          Browse sustainability projects or create your own to collaborate with others and make an impact
        </p>
      </div>
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse Projects</TabsTrigger>
          <TabsTrigger value="create">Create Project</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4 mt-6">
          <ProjectMarketplace />
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4 mt-6">
          <CreateProjectForm />
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4 mt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Project Applications Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You'll be able to track your project applications and their status here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
