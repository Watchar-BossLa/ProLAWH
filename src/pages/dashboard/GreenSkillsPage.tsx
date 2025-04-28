
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useGreenSkillsData } from '@/hooks/useGreenSkillsData';
import { ImpactVisualization } from '@/components/skills/ImpactVisualization';
import { GreenCareerPathway } from '@/components/skills/GreenCareerPathway';
import { SkillVerification } from '@/components/skills/SkillVerification';
import { GreenProjectsMarketplace } from '@/components/skills/GreenProjectsMarketplace';
import { GreenSkillsFilter } from '@/components/skills/GreenSkillsFilter';

export default function GreenSkillsPage() {
  const { data: greenSkills = [], isLoading, error } = useGreenSkills();
  const analytics = useGreenSkillsData();
  const [activeTab, setActiveTab] = useState("overview");

  // Extract unique categories for filtering
  const categories = Array.from(new Set(greenSkills.map(s => s.category)));

  const handleFilterChange = (filter: { search: string; category: string; impactLevel: string }) => {
    // This would be implemented to filter the displayed skills
    console.log("Filter applied:", filter);
  };

  if (error) {
    return <GreenSkillsError message={(error as Error).message} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <GreenSkillsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <GreenSkillsLoading />
        ) : (
          <>
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <PersonalImpactMetrics
                  carbonReduction={analytics.personalMetrics.carbonReduction}
                  skillsAcquired={analytics.personalMetrics.skillsAcquired}
                  marketGrowth={analytics.personalMetrics.marketGrowth}
                />
                <ImpactVisualization 
                  environmentalImpact={analytics.environmentalImpact}
                  totalReduction={analytics.environmentalImpact.reduce((sum, item) => sum + item.value, 0)}
                />
              </div>
              
              <Separator className="my-6" />
              <GreenSkillsOverview />
              <Separator className="my-6" />
              <TopGreenSkills skills={greenSkills} />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <GreenSkillsFilter 
                    categories={categories} 
                    onFilterChange={handleFilterChange}
                  />
                  <div className="mt-6">
                    <SkillVerification />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <GreenSkillStats skills={greenSkills} />
                  <GreenSkillCategories skills={greenSkills} />
                  <GreenSkillsList skills={greenSkills} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="careers" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <GreenCareerPathway careerOptions={analytics.careerOptions} />
                <GreenSkillsLearningPath recommendations={analytics.learningPaths} />
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6 mt-6">
              <GreenProjectsMarketplace projects={analytics.projects} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
