
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProfileSidebar } from "@/components/network/profile/ProfileSidebar";
import { ProfileTabs } from "@/components/network/profile/ProfileTabs";
import { MentorshipRequestForm } from "@/components/network/mentorship/form/MentorshipRequestForm";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { toast } from "sonner";

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
  
  const handleMentorshipRequest = (request: MentorshipRequest) => {
    console.log("Mentorship request:", request);
    // Fix: Changed from object with title/description properties to string arguments
    toast("Mentorship Request Sent", {
      description: `Your request to ${connection?.name} has been sent successfully.`
    });
    setShowMentorshipForm(false);
  };

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
          <ProfileTabs
            connection={connection}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showMentorshipForm={showMentorshipForm}
            setShowMentorshipForm={setShowMentorshipForm}
            isMentor={isMentor}
            isPendingMentor={isPendingMentor}
          />
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
