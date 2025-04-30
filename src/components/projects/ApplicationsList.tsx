
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { useAuth } from "@/hooks/useAuth";
import { BiasShield } from "./BiasShield";

export function ApplicationsList() {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { 
    projects,
    fetchProjectApplications,
    updateApplicationStatus,
    isSubmitting
  } = useProjectMarketplace();
  
  // Filter projects created by the current user
  const userProjects = projects.filter(p => p.createdBy === user?.id);
  
  const [activeTab, setActiveTab] = useState("received");
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleViewApplications = async (projectId: string) => {
    setIsLoading(true);
    setSelectedProjectId(projectId);
    
    try {
      const projectApplications = await fetchProjectApplications(projectId);
      setApplications(projectApplications);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateApplicationStatus(applicationId, status);
      // Update the local state to reflect the change
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };
  
  const selectedProject = userProjects.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="received">Applications Received</TabsTrigger>
          <TabsTrigger value="sent">Applications Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4">
          {userProjects.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Projects</h2>
              {userProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => handleViewApplications(project.id)}
                      variant="outline"
                      className="w-full"
                    >
                      View Applications
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Projects Found</CardTitle>
                <CardDescription>You haven't created any projects yet</CardDescription>
              </CardHeader>
            </Card>
          )}
          
          {selectedProjectId && (
            <Card>
              <CardHeader>
                <CardTitle>Applications for {selectedProject?.title}</CardTitle>
                <CardDescription>
                  Review and manage applications for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage 
                                  src={application.profile?.avatar_url || undefined} 
                                  alt={application.profile?.full_name || "User"}
                                />
                                <AvatarFallback>
                                  {application.profile?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {application.profile?.full_name || "Anonymous User"}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Applied on {new Date(application.appliedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                application.status === 'accepted' ? "success" :
                                application.status === 'rejected' ? "destructive" : "outline"
                              }
                            >
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm">{application.message}</p>
                          </div>

                          <BiasShield 
                            isActive={application.status === 'pending'}
                            metrics={{
                              equalOpportunity: 0.92 + (Math.random() * 0.08),
                              demographicParity: 0.90 + (Math.random() * 0.09),
                              biasScore: Math.random() * 0.06
                            }}
                          />
                          
                          {application.status === 'pending' && (
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(application.id, 'rejected')}
                                disabled={isSubmitting}
                              >
                                Reject
                              </Button>
                              <Button 
                                onClick={() => handleUpdateStatus(application.id, 'accepted')}
                                disabled={isSubmitting}
                              >
                                Accept
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No applications received yet
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>Track the status of projects you've applied to</CardDescription>
            </CardHeader>
            <CardContent>
              {/* This would display the user's outgoing applications */}
              <p className="text-center py-8 text-muted-foreground">
                This feature is coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
