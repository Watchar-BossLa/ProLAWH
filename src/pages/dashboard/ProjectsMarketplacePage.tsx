
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
import { ApplicationsList } from "@/components/projects/ApplicationsList";
import { useAuth } from "@/hooks/useAuth"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function ProjectsMarketplacePage() {
  const [activeTab, setActiveTab] = useState("browse");
  const { user, signIn } = useAuth();
  
  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Green Project Marketplace</h1>
        <p className="text-muted-foreground">
          Browse sustainability projects or create your own to collaborate with others and make an impact
        </p>
      </div>
      <Separator />
      
      {!user ? (
        <Alert>
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Sign in to create projects or apply to existing ones.</span>
            <Button variant="outline" onClick={signIn}>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse Projects</TabsTrigger>
          {user && <TabsTrigger value="create">Create Project</TabsTrigger>}
          {user && <TabsTrigger value="applications">My Applications</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="browse" className="space-y-4 mt-6">
          <ProjectMarketplace />
        </TabsContent>
        
        {user && (
          <TabsContent value="create" className="space-y-4 mt-6">
            <CreateProjectForm />
          </TabsContent>
        )}
        
        {user && (
          <TabsContent value="applications" className="space-y-4 mt-6">
            <ApplicationsList />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
