
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GreenSkillsHeader } from '@/components/skills/GreenSkillsHeader';
import { GreenSkillsLoading } from '@/components/skills/GreenSkillsLoading';
import { GreenSkillsError } from '@/components/skills/GreenSkillsError';
import { useGreenSkills } from '@/hooks/useGreenSkills';
import { useGreenSkillsData } from '@/hooks/useGreenSkillsData';
import { useSDGData } from '@/hooks/useSDGData';
import { useSkillGapData } from '@/hooks/useSkillGapData';
import { GreenSkillsOverview } from '@/components/skills/GreenSkillsOverview';
import { TopGreenSkills } from '@/components/skills/TopGreenSkills';
import { PersonalImpactMetrics } from '@/components/skills/PersonalImpactMetrics';
import { ImpactVisualization } from '@/components/skills/ImpactVisualization';
import { ImpactTabContent } from '@/components/skills/impact/ImpactTabContent';
import { SkillsTabContent } from '@/components/skills/SkillsTabContent';
import { CareersTabContent } from '@/components/skills/careers/CareersTabContent';
import { ProjectsTabContent } from '@/components/skills/projects/ProjectsTabContent';

export default function GreenSkillsPage() {
  const { data: greenSkills = [], isLoading, error } = useGreenSkills();
  const analytics = useGreenSkillsData();
  const [activeTab, setActiveTab] = useState("overview");
  const sdgData = useSDGData();
  const skillGapData = useSkillGapData();

  // Sample user skills for the Career Twin Simulator
  const userSkills = [
    "Solar Panel Installation",
    "Energy Efficiency",
    "Sustainability Reporting",
    "Waste Reduction",
    "Environmental Assessment"
  ];
  
  // Sample project for team formation
  const sampleProject = {
    title: "Community Solar Initiative",
    description: "Implement solar power systems in underserved communities",
    requiredSkills: ["Solar Energy", "Project Management", "Community Engagement", "Grant Writing"]
  };

  // Extract unique categories for filtering
  const categories = Array.from(new Set(greenSkills.map(s => s.category)));

  const handleFilterChange = (filter: { search: string; category: string; impactLevel: string }) => {
    console.log("Filter applied:", filter);
  };

  if (error) {
    return <GreenSkillsError message={(error as Error).message} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-in fade-in">
      <GreenSkillsHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 md:w-[750px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
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

            <TabsContent value="skills">
              <SkillsTabContent 
                skills={greenSkills}
                categories={categories}
                skillGapData={skillGapData}
                onFilterChange={handleFilterChange}
              />
            </TabsContent>

            <TabsContent value="impact">
              <ImpactTabContent 
                environmentalImpact={analytics.environmentalImpact}
                sdgData={sdgData}
              />
            </TabsContent>

            <TabsContent value="careers">
              <CareersTabContent 
                userSkills={userSkills}
                careerOptions={analytics.careerOptions}
                learningPaths={analytics.learningPaths}
              />
            </TabsContent>
            
            <TabsContent value="projects">
              <ProjectsTabContent 
                selectedProject={sampleProject}
                projects={analytics.projects}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
