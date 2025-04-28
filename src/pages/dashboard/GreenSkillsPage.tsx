
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { GreenSkillsList } from '@/components/skills/GreenSkillsList';
import { GreenSkillStats } from '@/components/skills/GreenSkillStats';
import { GreenSkillsOverview } from '@/components/skills/GreenSkillsOverview';
import { GreenSkillCategories } from '@/components/skills/GreenSkillCategories';
import { TopGreenSkills } from '@/components/skills/TopGreenSkills';
import { PersonalImpactMetrics } from '@/components/skills/PersonalImpactMetrics';
import { GreenSkillsLearningPath } from '@/components/skills/GreenSkillsLearningPath';
import { GreenSkillsHeader } from '@/components/skills/GreenSkillsHeader';
import { GreenSkillsLoading } from '@/components/skills/GreenSkillsLoading';
import { GreenSkillsError } from '@/components/skills/GreenSkillsError';
import { useGreenSkills } from '@/hooks/useGreenSkills';

const mockLearningPaths = [
  {
    id: "1",
    title: "Sustainable Supply Chain Management",
    description: "Master green logistics and sustainable procurement",
    duration: "8 weeks",
    level: "Intermediate"
  },
  {
    id: "2",
    title: "Renewable Energy Technologies",
    description: "Deep dive into solar, wind, and energy storage",
    duration: "12 weeks",
    level: "Advanced"
  },
  {
    id: "3",
    title: "ESG Analysis Fundamentals",
    description: "Learn to evaluate environmental and social impact",
    duration: "6 weeks",
    level: "Beginner"
  }
];

export default function GreenSkillsPage() {
  const { data: greenSkills = [], isLoading, error } = useGreenSkills();

  if (error) {
    return <GreenSkillsError message={(error as Error).message} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <GreenSkillsHeader />
      
      {isLoading ? (
        <GreenSkillsLoading />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <PersonalImpactMetrics
              carbonReduction={75}
              skillsAcquired={6}
              marketGrowth={85}
            />
            <GreenSkillsLearningPath recommendations={mockLearningPaths} />
          </div>
          
          <Separator className="my-8" />
          <GreenSkillsOverview />
          <Separator className="my-8" />
          <TopGreenSkills skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillStats skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillCategories skills={greenSkills} />
          <Separator className="my-8" />
          <GreenSkillsList skills={greenSkills} />
        </>
      )}
    </div>
  );
}
