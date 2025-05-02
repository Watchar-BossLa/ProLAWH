
import { useEffect, useState } from "react";
import { useArcadeChallenges } from "@/hooks/useArcadeChallenges";
import { ChallengeCard } from "@/components/arcade/ChallengeCard";
import { ArcadeIntro } from "@/components/arcade/ArcadeIntro";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { pageTransitions } from "@/lib/transitions";
import { useAuth } from "@/hooks/useAuth";

export default function ArcadePage() {
  const { data: challenges, isLoading, error } = useArcadeChallenges();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock challenges data for testing
  const mockChallenges = [
    {
      id: "1",
      title: "Python Data Structures",
      description: "Demonstrate basic Python data structure knowledge",
      difficulty_level: "beginner" as const,
      points: 50,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show code examples of Python lists, dictionaries, and tuples",
      validation_rules: {
        required_items: ["python", "list", "dictionary"]
      }
    },
    {
      id: "2",
      title: "Kubernetes Architecture",
      description: "Identify key components in Kubernetes architecture",
      difficulty_level: "intermediate" as const,
      points: 100,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show a diagram or representation of Kubernetes pods, services, and deployments",
      validation_rules: {
        required_items: ["kubernetes", "pod", "service", "deployment"]
      }
    },
    {
      id: "3",
      title: "Rust Memory Safety",
      description: "Explain Rust's ownership and borrowing system",
      difficulty_level: "advanced" as const,
      points: 150,
      time_limit: 60,
      type: "camera" as const,
      instructions: "Show and explain code examples demonstrating ownership, borrowing and lifetimes in Rust",
      validation_rules: {
        required_items: ["rust", "ownership", "borrowing"]
      }
    }
  ];

  const displayChallenges = challenges?.length ? challenges : mockChallenges;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Challenges</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3 mb-8">
        <Gamepad2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Nano-Challenge Arcade</h1>
          <p className="text-muted-foreground">Complete quick challenges to earn verifiable credentials</p>
        </div>
      </div>

      <ArcadeIntro />

      {isLoading ? (
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
      ) : displayChallenges.length === 0 ? (
        <div className="text-center py-12">
          <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Challenges Available</h3>
          <p className="text-muted-foreground">Check back soon for new challenges!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in-50 duration-500">
          {displayChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
