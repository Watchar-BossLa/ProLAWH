
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { SkillBadge } from "@/hooks/useSkillBadges";

interface BadgeCardProps {
  badge: SkillBadge;
  isEarned?: boolean;
}

export function BadgeCard({ badge, isEarned }: BadgeCardProps) {
  return (
    <Card className={isEarned ? "border-primary" : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{badge.name}</CardTitle>
          <Trophy className={`h-6 w-6 ${isEarned ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{badge.category}</span>
          <span className="font-medium">{badge.points} points</span>
        </div>
      </CardContent>
    </Card>
  );
}
