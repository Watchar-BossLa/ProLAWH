
import { useState, useEffect } from "react";
import { useMentorship } from "@/hooks/useMentorship";
import { MentorshipCard } from "@/components/mentorship/MentorshipCard";
import { MentorshipFilters } from "@/components/mentorship/MentorshipFilters";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export function MentorshipList() {
  const [activeTab, setActiveTab] = useState<string>("active");
  const [mentorships, setMentorships] = useState<any[]>([]);
  const { user } = useAuth();
  const { getMentorshipRelationships, loading, error } = useMentorship();

  useEffect(() => {
    loadMentorships();
  }, [activeTab, user]);

  const loadMentorships = async () => {
    if (!user) return;
    
    const data = await getMentorshipRelationships(activeTab);
    if (data) {
      setMentorships(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Mentorships</h2>
        <Button variant="outline" onClick={loadMentorships}>
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <MentorshipFilters />
        
        <TabsContent value={activeTab} className="pt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Error loading mentorships. Please try again.
            </div>
          ) : mentorships.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mentorships.map((mentorship) => (
                <MentorshipCard 
                  key={mentorship.id} 
                  mentorship={mentorship} 
                  isMentor={user?.id === mentorship.mentor_id} 
                  onUpdate={loadMentorships}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No {activeTab} mentorships found. 
              {activeTab === 'active' && (
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setActiveTab("pending")}>
                    Check pending requests
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
