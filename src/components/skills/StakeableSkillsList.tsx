
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
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching skills:", error);
        return;
      }

      setSkills(data || []);
      setIsLoading(false);
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
