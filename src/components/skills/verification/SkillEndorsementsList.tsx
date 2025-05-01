
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkillVerification } from "@/hooks/useSkillVerification";
import { SkillEndorsement } from "@/services/skillVerificationService";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface SkillEndorsementsListProps {
  skillId: string;
  userId: string;
  skillName: string;
}

interface EndorserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function SkillEndorsementsList({ skillId, userId, skillName }: SkillEndorsementsListProps) {
  const { endorseSkill, isSubmittingEndorsement, fetchEndorsements } = useSkillVerification();
  const [endorsements, setEndorsements] = useState<SkillEndorsement[]>([]);
  const [endorserProfiles, setEndorserProfiles] = useState<Record<string, EndorserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadEndorsements = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEndorsements(userId, skillId);
        setEndorsements(data);
        
        // Fetch profiles for endorsers
        if (data.length > 0) {
          const endorserIds = data.map(e => e.endorser_id);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', endorserIds);
            
          if (profiles) {
            const profileMap: Record<string, EndorserProfile> = {};
            profiles.forEach(profile => {
              profileMap[profile.id] = profile;
            });
            setEndorserProfiles(profileMap);
          }
        }
      } catch (error) {
        console.error("Error loading endorsements:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEndorsements();
  }, [skillId, userId, fetchEndorsements]);

  const handleEndorse = async () => {
    try {
      await endorseSkill(skillId, userId, comment);
      setComment("");
      setIsDialogOpen(false);
      
      // Refresh endorsements
      const newEndorsements = await fetchEndorsements(userId, skillId);
      setEndorsements(newEndorsements);
    } catch (error) {
      console.error("Error submitting endorsement:", error);
    }
  };

  const getInitials = (name: string | null): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skill Endorsements</CardTitle>
          <CardDescription>Loading endorsements...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skill Endorsements</CardTitle>
          <CardDescription>
            {endorsements.length 
              ? `${endorsements.length} endorsements for ${skillName}`
              : `No endorsements yet for ${skillName}`
            }
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Endorse Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Endorse {skillName}</DialogTitle>
              <DialogDescription>
                Your endorsement helps verify this person's skill and improves their credibility.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Share your experience working with this person or knowledge of their skills."
                className="min-h-[100px]"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button 
                onClick={handleEndorse} 
                disabled={isSubmittingEndorsement}
              >
                {isSubmittingEndorsement ? "Submitting..." : "Submit Endorsement"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {endorsements.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Be the first to endorse this skill.
            </p>
          ) : (
            endorsements.map(endorsement => {
              const endorser = endorserProfiles[endorsement.endorser_id];
              return (
                <div key={endorsement.id} className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={endorser?.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(endorser?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {endorser?.full_name || "Anonymous User"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(endorsement.created_at), "MMM d, yyyy")}
                    </div>
                    {endorsement.comment && (
                      <p className="mt-1 text-sm">{endorsement.comment}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
