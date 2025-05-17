
import { Gamepad2 } from "lucide-react";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import type { Challenge } from "@/types/arcade";

interface ChallengeGridProps {
  isLoading: boolean;
  challenges: Challenge[];
}

export function ChallengeGrid({ isLoading, challenges }: ChallengeGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (challenges.length === 0) {
    return (
      <div className="text-center py-12">
        <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Challenges Available</h3>
        <p className="text-muted-foreground">No challenges match your current filters. Try adjusting them or check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-500">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
        />
      ))}
    </div>
  );
}
