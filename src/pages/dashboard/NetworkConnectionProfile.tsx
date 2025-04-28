import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/network/ChatInterface";
import { MentorshipDetails } from "@/components/network/MentorshipDetails";
import { MentorshipRequestForm } from "@/components/network/MentorshipRequestForm";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { toast } from "@/hooks/use-toast";
import { User, Book, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProfileSidebar } from "@/components/network/profile/ProfileSidebar";
import { ExperienceTimeline } from "@/components/network/profile/ExperienceTimeline";
import { RecentActivity } from "@/components/network/profile/RecentActivity";

const mockConnection: NetworkConnection = {
  id: "1",
  userId: "user1",
  name: "Sarah Chen",
  role: "Senior Developer",
  company: "TechCorp",
  connectionType: "mentor",
  connectionStrength: 85,
  lastInteraction: "2025-04-20",
  status: "connected",
  skills: ["React", "TypeScript", "UI/UX", "System Architecture", "Leadership"],
  bio: "Tech lead with 10+ years in frontend development. I specialize in building scalable, accessible web applications and mentoring junior developers.",
  location: "San Francisco, CA",
  onlineStatus: "online",
  industry: "Technology",
  careerPath: "Software Engineering",
  expertise: ["Frontend Development", "React Ecosystem", "Team Leadership"],
  mentorship: {
    id: "m-1",
    status: "active",
    startDate: "2025-02-15",
    focusAreas: ["React Development", "Career Growth", "Technical Leadership"],
    meetingFrequency: "biweekly",
    nextMeetingDate: "2025-05-10",
    industry: "Technology",
    resources: [
      {
        id: "r-1",
        title: "Advanced React Patterns",
        type: "article",
        url: "https://example.com/article",
        description: "Deep dive into complex React patterns and optimizations",
        addedBy: "user1",
        addedAt: "2025-03-01",
        completed: true
      },
      {
        id: "r-2",
        title: "Tech Leadership Course",
        type: "course",
        url: "https://example.com/course",
        description: "10-week course on tech leadership fundamentals",
        addedBy: "user1",
        addedAt: "2025-03-15",
        completed: false
      }
    ],
    goals: [
      "Master advanced React patterns",
      "Take on technical leadership role in next 6 months",
      "Improve system architecture skills"
    ],
    progress: [
      {
        id: "p-1",
        date: "2025-03-01",
        milestone: "Completed React patterns workshop",
        notes: "Successfully implemented compound components pattern in project",
        completed: true
      },
      {
        id: "p-2",
        date: "2025-04-01",
        milestone: "Lead first architecture review",
        notes: "",
        completed: false
      }
    ]
  }
};

export default function NetworkConnectionProfile() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const [connection, setConnection] = useState<NetworkConnection | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showMentorshipForm, setShowMentorshipForm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (connectionId) {
      setConnection(mockConnection);
    }
  }, [connectionId]);
  
  if (!connection) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Loading connection profile...</p>
      </div>
    );
  }
  
  const isMentor = connection.connectionType === 'mentor';
  const isPendingMentor = connection.mentorship?.status === 'pending';
  const hasActiveMentorship = connection.mentorship?.status === 'active';
  
  const handleMentorshipRequest = (request: MentorshipRequest) => {
    console.log("Mentorship request:", request);
    toast({
      title: "Mentorship Request Sent",
      description: `Your request to ${connection?.name} has been sent successfully.`,
    });
    setShowMentorshipForm(false);
  };

  const experiences = [
    {
      role: connection.role,
      company: connection.company,
      period: "2022 - Present",
      isActive: true
    },
    {
      role: "Lead Developer",
      company: "Previous Company",
      period: "2018 - 2022"
    },
    {
      role: "Senior Developer",
      company: "First Tech Company",
      period: "2015 - 2018"
    }
  ];

  const recentActivities = [
    {
      content: "Shared a resource on React Server Components",
      timestamp: "2 days ago"
    },
    {
      content: "Earned a new badge in System Architecture",
      timestamp: "1 week ago"
    }
  ];

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/dashboard/network")}
      >
        ← Back to Network
      </Button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3">
          <ProfileSidebar
            connection={connection}
            isPendingMentor={isPendingMentor}
            onOpenChat={() => setActiveTab("chat")}
            onOpenMentorshipForm={() => setShowMentorshipForm(true)}
          />
        </div>
        
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="mentorship">
                <Book className="h-4 w-4 mr-2" />
                Mentorship
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                  <CardDescription>
                    {connection.name}'s career information and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Career Path</h3>
                      <p className="text-sm text-muted-foreground">
                        {connection.careerPath || "Software Engineering"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Experience</h3>
                      <ExperienceTimeline experiences={experiences} />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Education</h3>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Master's in Computer Science</h4>
                          <p className="text-sm">University of Technology</p>
                          <p className="text-xs text-muted-foreground">2013 - 2015</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                      <RecentActivity activities={recentActivities} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mentorship" className="mt-6">
              {hasActiveMentorship ? (
                <MentorshipDetails 
                  mentorship={connection.mentorship!} 
                  isOwnProfile={false} 
                  isMentor={isMentor}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Active Mentorship</CardTitle>
                    <CardDescription>
                      {isPendingMentor 
                        ? "Your mentorship request is pending approval."
                        : "You don't have an active mentorship with this connection."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isMentor && !isPendingMentor && (
                      <Button onClick={() => setShowMentorshipForm(true)}>
                        <Book className="h-4 w-4 mr-2" />
                        Request Mentorship
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <ChatInterface 
                connection={connection} 
                onClose={() => setActiveTab("profile")} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Dialog open={showMentorshipForm} onOpenChange={(open) => !open && setShowMentorshipForm(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <MentorshipRequestForm
            connection={connection}
            isOpen={showMentorshipForm}
            onClose={() => setShowMentorshipForm(false)}
            onSubmit={handleMentorshipRequest}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
