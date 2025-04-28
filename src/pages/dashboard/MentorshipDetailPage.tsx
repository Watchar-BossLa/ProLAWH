
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMentorship } from "@/hooks/useMentorship";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Calendar, BookOpen, MessageCircle, PlusIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { MentorshipSessionCard } from "@/components/mentorship/MentorshipSessionCard";
import { MentorshipSessionForm } from "@/components/mentorship/MentorshipSessionForm";
import { MentorshipResourceForm } from "@/components/mentorship/MentorshipResourceForm";

export default function MentorshipDetailPage() {
  const { mentorshipId } = useParams<{ mentorshipId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [relationship, setRelationship] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    getMentorshipRelationships, 
    getMentorshipSessions,
    getMentorshipResources,
    getMentorshipProgress
  } = useMentorship();

  useEffect(() => {
    if (mentorshipId) {
      loadMentorshipData();
    }
  }, [mentorshipId]);

  const loadMentorshipData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get mentorship relationship
      const relationships = await getMentorshipRelationships();
      if (!relationships) {
        throw new Error("Failed to load mentorship data");
      }
      
      const currentRelationship = relationships.find((r: any) => r.id === mentorshipId);
      if (!currentRelationship) {
        throw new Error("Mentorship not found");
      }
      
      setRelationship(currentRelationship);
      
      // Get sessions, resources, and progress
      const [sessionsData, resourcesData, progressData] = await Promise.all([
        getMentorshipSessions(mentorshipId),
        getMentorshipResources(mentorshipId),
        getMentorshipProgress(mentorshipId)
      ]);
      
      setSessions(sessionsData || []);
      setResources(resourcesData || []);
      setProgress(progressData || []);
    } catch (err) {
      console.error("Error loading mentorship data:", err);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !relationship) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/mentorship")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Mentorship Dashboard
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error?.message || "Mentorship not found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/dashboard/mentorship")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMentor = user?.id === relationship.mentor_id;
  const otherPerson = isMentor ? relationship.mentee : relationship.mentor;
  const otherPersonName = otherPerson?.profiles?.full_name || "User";
  const otherPersonAvatar = otherPerson?.profiles?.avatar_url;
  
  const initials = otherPersonName
    .split(" ")
    .map((part: string) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
    
  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    paused: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    declined: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/dashboard/mentorship")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Mentorship Dashboard
      </Button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar - Profile info */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  {otherPersonAvatar ? (
                    <AvatarImage src={otherPersonAvatar} alt={otherPersonName} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-center">{otherPersonName}</CardTitle>
                <CardDescription className="text-center">
                  {isMentor ? "Your Mentee" : "Your Mentor"}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center mb-2">
                  <Badge className={statusColors[relationship.status] || ""}>
                    {relationship.status.charAt(0).toUpperCase() + relationship.status.slice(1)}
                  </Badge>
                </div>
                
                {relationship.meeting_frequency && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Meeting Frequency</h4>
                    <p className="text-sm">{relationship.meeting_frequency}</p>
                  </div>
                )}
                
                {relationship.focus_areas && relationship.focus_areas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {relationship.focus_areas.map((area: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {relationship.goals && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Goals</h4>
                    <p className="text-sm whitespace-pre-line">{relationship.goals}</p>
                  </div>
                )}

                {relationship.status === 'active' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1" 
                      onClick={() => setShowSessionForm(true)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          <Tabs defaultValue="sessions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Mentorship Sessions</CardTitle>
                      <CardDescription>
                        Schedule and manage your mentorship sessions
                      </CardDescription>
                    </div>
                    
                    {relationship.status === 'active' && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSessionForm(true)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Schedule Session
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {sessions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {sessions
                          .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime())
                          .map((session) => (
                            <MentorshipSessionCard
                              key={session.id}
                              session={session}
                              isMentor={isMentor}
                              onUpdate={loadMentorshipData}
                            />
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No sessions scheduled yet.
                      {relationship.status === 'active' && (
                        <div className="mt-2">
                          <Button onClick={() => setShowSessionForm(true)}>
                            Schedule Your First Session
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Shared Resources</CardTitle>
                      <CardDescription>
                        Learning materials, articles, and tools for your mentorship journey
                      </CardDescription>
                    </div>
                    
                    {relationship.status === 'active' && (
                      <Button 
                        variant="outline" 
                        onClick={() => setShowResourceForm(true)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {resources.length > 0 ? (
                    <div className="space-y-4">
                      {resources.map((resource) => (
                        <div 
                          key={resource.id}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{resource.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="capitalize">
                                  {resource.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Added {new Date(resource.added_at).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  by {resource.added_by === user?.id ? "You" : "Other"}
                                </span>
                              </div>
                              {resource.description && (
                                <p className="text-sm mt-2">{resource.description}</p>
                              )}
                            </div>
                            <div>
                              <Badge variant={resource.completed ? "default" : "outline"}>
                                {resource.completed ? "Completed" : "Not Completed"}
                              </Badge>
                            </div>
                          </div>
                          
                          {resource.url && (
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                className="text-sm h-8"
                                onClick={() => window.open(resource.url, '_blank')}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                View Resource
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No resources have been shared yet.
                      {relationship.status === 'active' && (
                        <div className="mt-2">
                          <Button onClick={() => setShowResourceForm(true)}>
                            Add Your First Resource
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Track milestones and achievements throughout your mentorship
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progress.length > 0 ? (
                    <div className="space-y-4">
                      <div className="relative">
                        {progress.map((item, index) => (
                          <div key={item.id} className="mb-8 relative">
                            <div className="flex items-center">
                              <div 
                                className={`w-4 h-4 rounded-full ${
                                  item.completed ? "bg-primary" : "bg-muted border border-muted-foreground"
                                } z-10`}
                              />
                              <div className="ml-4">
                                <h4 className="font-medium">{item.milestone}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString()}
                                </p>
                                {item.notes && (
                                  <p className="text-sm mt-1">{item.notes}</p>
                                )}
                              </div>
                              <div className="ml-auto">
                                <Badge variant={item.completed ? "default" : "outline"}>
                                  {item.completed ? "Completed" : "In Progress"}
                                </Badge>
                              </div>
                            </div>
                            {index < progress.length - 1 && (
                              <div className="absolute h-full border-l border-muted-foreground/30 left-2 top-0 z-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No progress milestones have been added yet.
                      {relationship.status === 'active' && (
                        <div className="mt-2">
                          <Button>
                            Add First Milestone
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Forms */}
      {showSessionForm && (
        <MentorshipSessionForm
          isOpen={showSessionForm}
          onClose={() => setShowSessionForm(false)}
          relationshipId={mentorshipId || ""}
          onSuccess={loadMentorshipData}
        />
      )}
      
      {showResourceForm && (
        <MentorshipResourceForm
          isOpen={showResourceForm}
          onClose={() => setShowResourceForm(false)}
          mentorshipId={mentorshipId || ""}
          onSuccess={loadMentorshipData}
        />
      )}
    </div>
  );
}
