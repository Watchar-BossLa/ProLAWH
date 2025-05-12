
import { useAuth } from "@/hooks/useAuth";
import { useSkillBadges, useUserBadges } from "@/hooks/useSkillBadges";
import { BadgeCard } from "@/components/skills/BadgeCard";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Trophy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function SkillsAndBadgesPage() {
  const { user } = useAuth();
  const { data: badges, isLoading: isBadgesLoading } = useSkillBadges();
  const { data: userBadges, isLoading: isUserBadgesLoading } = useUserBadges(user?.id ?? "");

  const earnedBadgeIds = userBadges?.map(ub => ub.badge_id) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Skills & Badges</h2>
          <p className="text-muted-foreground">
            Complete challenges to earn badges and showcase your skills
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <Alert>
        <Trophy className="h-4 w-4" />
        <AlertTitle>Earn Badges</AlertTitle>
        <AlertDescription>
          Complete Nano-Arcade challenges to demonstrate your skills and earn verifiable badges.
          Each badge represents mastery in different technical domains.
        </AlertDescription>
      </Alert>

      {(isBadgesLoading || isUserBadgesLoading) ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-2/3 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : badges?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              isEarned={earnedBadgeIds.includes(badge.id)} 
            />
          ))}
        </div>
      ) : (
        <Alert variant="default">
          <AlertTitle>No badges available</AlertTitle>
          <AlertDescription>
            Check back later for new badges to earn!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
