
import { useState } from "react";
import { MentorshipList } from "@/components/mentorship/MentorshipList";
import { MentorFinderSection } from "@/components/mentorship/MentorFinderSection";
import { CareerTwinMentorRecommendations } from "@/components/mentorship/CareerTwinMentorRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  Users, 
  CalendarIcon, 
  ArrowUpRight 
} from "lucide-react";

export default function MentorshipDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the mentorship dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mentorship Hub</h2>
        <p className="text-muted-foreground">
          Connect with mentors, share knowledge, and grow your skills
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentorships</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 as mentee, 1 as mentor
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next session in 2 days
            </p>
          </CardContent>
        </Card>

        <Card className="hover-card glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <div className="flex mt-1">
              <Button variant="link" className="h-auto p-0 text-xs">View all requests</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Career Twin Mentor Recommendations Section */}
      <CareerTwinMentorRecommendations />

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="find-mentor">Find a Mentor</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <MentorshipList />
          
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>
                Share your expertise and help others grow professionally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                As a mentor, you'll have the opportunity to guide others, share your knowledge,
                and make a positive impact on someone else's career journey.
              </p>
              <Button>
                Create Mentor Profile <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="find-mentor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find a Mentor</CardTitle>
              <CardDescription>
                Connect with experienced professionals who can guide your growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MentorFinderSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Requests</CardTitle>
              <CardDescription>
                Manage your incoming and outgoing mentorship requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="outgoing">
                <TabsList className="mb-4">
                  <TabsTrigger value="outgoing">Sent by You</TabsTrigger>
                  <TabsTrigger value="incoming">Received</TabsTrigger>
                </TabsList>
                
                <TabsContent value="outgoing" className="space-y-4">
                  <p className="text-muted-foreground py-8 text-center">
                    You don't have any pending outgoing requests.
                  </p>
                </TabsContent>
                
                <TabsContent value="incoming" className="space-y-4">
                  <p className="text-muted-foreground py-8 text-center">
                    You don't have any pending incoming requests.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
