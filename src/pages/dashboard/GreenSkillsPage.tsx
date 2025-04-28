
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
import { CarbonFootprintCalculator } from '@/components/skills/CarbonFootprintCalculator';
import { SDGAlignmentChart } from '@/components/skills/SDGAlignmentChart';
import { useSDGData } from '@/hooks/useSDGData';
import { AI } from 'lucide-react';
import { CareerTwinSimulator } from '@/components/skills/AI/CareerTwinSimulator';
import { SkillGapAnalysis } from '@/components/skills/SkillGapAnalysis';
import { useSkillGapData } from '@/hooks/useSkillGapData';
import { TeamFormationSimulator } from '@/components/skills/TeamFormationSimulator';

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
                  <div className="mt-6">
                    <SkillGapAnalysis skillGapData={skillGapData} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <GreenSkillStats skills={greenSkills} />
                  <GreenSkillCategories skills={greenSkills} />
                  <GreenSkillsList skills={greenSkills} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <CarbonFootprintCalculator />
                <SDGAlignmentChart sdgData={sdgData} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <ImpactVisualization 
                  environmentalImpact={analytics.environmentalImpact}
                  totalReduction={analytics.environmentalImpact.reduce((sum, item) => sum + item.value, 0)}
                />
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Environmental Impact Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Earn badges by completing sustainability challenges and making real-world impact.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Placeholder badges */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                          <Leaf className="h-8 w-8 text-green-600" />
                        </div>
                        <span className="text-xs text-center">Carbon Reducer</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                          <Drop className="h-8 w-8 text-blue-600" />
                        </div>
                        <span className="text-xs text-center">Water Saver</span>
                      </div>
                      <div className="flex flex-col items-center opacity-40">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                          <Sun className="h-8 w-8 text-amber-600" />
                        </div>
                        <span className="text-xs text-center">Solar Champion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="careers" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <CareerTwinSimulator userSkills={userSkills} />
                <GreenCareerPathway careerOptions={analytics.careerOptions} />
              </div>
              <div className="mt-6">
                <GreenSkillsLearningPath recommendations={analytics.learningPaths} />
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-1">
                  <TeamFormationSimulator selectedProject={sampleProject} />
                </div>
                <div className="md:col-span-2">
                  <GreenProjectsMarketplace projects={analytics.projects} />
                </div>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

// Additional imports needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Leaf, Drop, Sun } from "lucide-react";
