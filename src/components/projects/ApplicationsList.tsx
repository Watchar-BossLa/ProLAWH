
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ApplicationsList() {
  const { userApplications, isLoadingApplications, projects } = useProjectMarketplace();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  if (isLoadingApplications) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getProjectTitle = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || "Unknown Project";
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'accepted': return 'success';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const filteredApplications = activeTab === 'all'
    ? userApplications
    : userApplications.filter(app => app.status === activeTab);
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Project Applications</CardTitle>
          <CardDescription>Track the status of your project applications</CardDescription>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {userApplications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {userApplications.filter(app => app.status === 'pending').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted
                <Badge variant="secondary" className="ml-2">
                  {userApplications.filter(app => app.status === 'accepted').length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <Badge variant="secondary" className="ml-2">
                  {userApplications.filter(app => app.status === 'rejected').length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredApplications.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No applications found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === 'all' 
                  ? "You haven't applied to any projects yet." 
                  : `You don't have any ${activeTab} applications.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map(application => (
                <Card key={application.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{getProjectTitle(application.projectId)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Applied on {formatDate(application.appliedAt)}
                        </p>
                      </div>
                      <Badge className="capitalize" variant={getStatusBadgeVariant(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                    
                    {application.message && (
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-sm" 
                          onClick={() => setSelectedApplication(application)}
                        >
                          View your message
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Application Message Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Your Application Message</DialogTitle>
            <DialogDescription>
              For: {selectedApplication ? getProjectTitle(selectedApplication.projectId) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedApplication?.message}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
