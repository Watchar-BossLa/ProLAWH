
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChatInterface } from "@/components/network/ChatInterface";
import { MentorshipDetails } from "@/components/network/MentorshipDetails";
import { MentorshipRequestForm } from "@/components/network/MentorshipRequestForm";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { toast } from "@/hooks/use-toast";
import { Book, User, MessageCircle, BarChart, Calendar } from "lucide-react";

// Mock data for development - in a real app this would come from your API
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
    // In a real app, you would fetch the connection data from your API
    // This is mock data for demonstration purposes
    if (connectionId) {
      setConnection(mockConnection);
    }
  }, [connectionId]);
  
  const handleMentorshipRequest = (request: MentorshipRequest) => {
    // In a real app, you would send this to your API
    console.log("Mentorship request:", request);
    toast({
      title: "Mentorship Request Sent",
      description: `Your request to ${connection?.name} has been sent successfully.`,
    });
    setShowMentorshipForm(false);
  };
  
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
        {/* Left sidebar - Profile info */}
        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  {connection.avatar ? (
                    <AvatarImage src={connection.avatar} alt={connection.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {connection.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <CardTitle className="text-center">{connection.name}</CardTitle>
                <CardDescription className="text-center">
                  {connection.role} at {connection.company}
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center mb-2 gap-2">
                  <Badge className="capitalize">{connection.connectionType}</Badge>
                  {connection.onlineStatus && (
                    <Badge variant="outline" className="capitalize">{connection.onlineStatus}</Badge>
                  )}
                </div>
                
                {connection.bio && (
                  <div className="py-2">
                    <p className="text-sm text-muted-foreground">{connection.bio}</p>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {connection.skills?.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {connection.location && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Location</h4>
                    <p className="text-sm">{connection.location}</p>
                  </div>
                )}
                
                {connection.industry && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Industry</h4>
                    <Badge variant="outline">{connection.industry}</Badge>
                  </div>
                )}
                
                {connection.expertise && connection.expertise.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-1">
                      {connection.expertise.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Connection Strength</span>
                    <span className="text-xs font-medium">{connection.connectionStrength}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${connection.connectionStrength}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => setActiveTab("chat")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  
                  {!isMentor && !isPendingMentor && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowMentorshipForm(true)}
                    >
                      <Book className="h-4 w-4 mr-2" />
                      Request Mentor
                    </Button>
                  )}
                  
                  {isPendingMentor && (
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Request Pending
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content area */}
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
                      <div className="space-y-4">
                        <div className="border-l-2 border-primary pl-4 py-1">
                          <h4 className="font-medium">{connection.role}</h4>
                          <p className="text-sm">{connection.company}</p>
                          <p className="text-xs text-muted-foreground">2022 - Present</p>
                        </div>
                        <div className="border-l-2 border-muted pl-4 py-1">
                          <h4 className="font-medium">Lead Developer</h4>
                          <p className="text-sm">Previous Company</p>
                          <p className="text-xs text-muted-foreground">2018 - 2022</p>
                        </div>
                        <div className="border-l-2 border-muted pl-4 py-1">
                          <h4 className="font-medium">Senior Developer</h4>
                          <p className="text-sm">First Tech Company</p>
                          <p className="text-xs text-muted-foreground">2015 - 2018</p>
                        </div>
                      </div>
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
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                          <div>
                            <p className="text-sm">Shared a resource on React Server Components</p>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                          <div>
                            <p className="text-sm">Earned a new badge in System Architecture</p>
                            <p className="text-xs text-muted-foreground">1 week ago</p>
                          </div>
                        </div>
                      </div>
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
      
      <MentorshipRequestForm
        connection={connection}
        isOpen={showMentorshipForm}
        onClose={() => setShowMentorshipForm(false)}
        onSubmit={handleMentorshipRequest}
      />
    </div>
  );
}
