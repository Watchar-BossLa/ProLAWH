
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillStakeDialog } from "./SkillStakeDialog";

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  is_green_skill: boolean;
  sustainability_score: number | null;
}

export function StakeableSkillsList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        // Mock data since the supabase client doesn't actually fetch data
        const mockSkills: Skill[] = [
          {
            id: "skill1",
            name: "Sustainable Web Development",
            category: "Software Development",
            description: "Development practices that minimize environmental impact",
            is_green_skill: true,
            sustainability_score: 85
          },
          {
            id: "skill2",
            name: "Ethical AI Implementation",
            category: "Artificial Intelligence",
            description: "Building AI systems with ethical considerations",
            is_green_skill: true,
            sustainability_score: 90
          },
          {
            id: "skill3",
            name: "Blockchain Smart Contracts",
            category: "Blockchain",
            description: "Creating and auditing smart contracts",
            is_green_skill: false,
            sustainability_score: null
          }
        ];

        setSkills(mockSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <Card key={skill.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {skill.name}
              {skill.is_green_skill && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Green
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{skill.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {skill.description || `Demonstrate your expertise in ${skill.name} by staking tokens.`}
            </p>
            {skill.sustainability_score && (
              <div className="mt-2">
                <Badge variant="secondary">Sustainability Score: {skill.sustainability_score}</Badge>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <SkillStakeDialog skillId={skill.id} skillName={skill.name} />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
