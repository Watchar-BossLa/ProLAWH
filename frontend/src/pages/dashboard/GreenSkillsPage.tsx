
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWrapper } from "@/components/ui/page-wrapper";
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
    return (
      <PageWrapper>
        <GreenSkillsError message={(error as Error).message} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Green Skills"
      description="Explore sustainable skills that contribute to environmental conservation and eco-friendly practices. Track their CO2 reduction potential and market growth rates to stay ahead in the green economy."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <TabsList className="grid grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs sm:text-sm">Skills</TabsTrigger>
            <TabsTrigger value="impact" className="text-xs sm:text-sm">Impact</TabsTrigger>
            <TabsTrigger value="careers" className="text-xs sm:text-sm">Careers</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
          </TabsList>
        </div>
        
        {isLoading ? (
          <GreenSkillsLoading />
        ) : (
          <>
            <TabsContent value="overview" className="space-y-8 mt-0">
              <div className="grid gap-6 lg:grid-cols-2">
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
              
              <Separator className="my-8" />
              
              <div className="space-y-8">
                <GreenSkillsOverview />
                <TopGreenSkills skills={greenSkills} />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-0">
              <SkillsTabContent 
                skills={greenSkills}
                categories={categories}
                skillGapData={skillGapData}
                onFilterChange={handleFilterChange}
              />
            </TabsContent>

            <TabsContent value="impact" className="mt-0">
              <ImpactTabContent 
                environmentalImpact={analytics.environmentalImpact}
                sdgData={sdgData}
              />
            </TabsContent>

            <TabsContent value="careers" className="mt-0">
              <CareersTabContent 
                userSkills={userSkills}
                careerOptions={analytics.careerOptions}
                learningPaths={analytics.learningPaths}
              />
            </TabsContent>
            
            <TabsContent value="projects" className="mt-0">
              <ProjectsTabContent 
                selectedProject={sampleProject}
                projects={analytics.projects}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </PageWrapper>
  );
}
