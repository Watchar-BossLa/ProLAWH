
import { Book, MessageCircle, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkConnection } from "@/types/network";
import { ProfileContent } from "./ProfileContent";
import { MentorshipDetails } from "../mentorship/MentorshipDetails";
import { ChatInterface } from "../ChatInterface";

interface ProfileTabsProps {
  connection: NetworkConnection;
  activeTab: string;
  setActiveTab: (value: string) => void;
  showMentorshipForm: boolean;
  setShowMentorshipForm: (show: boolean) => void;
  isMentor: boolean;
  isPendingMentor: boolean;
}

export function ProfileTabs({
  connection,
  activeTab,
  setActiveTab,
  showMentorshipForm,
  setShowMentorshipForm,
  isMentor,
  isPendingMentor
}: ProfileTabsProps) {
  const hasActiveMentorship = connection.mentorship?.status === 'active';

  return (
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
        <ProfileContent connection={connection} />
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
  );
}
