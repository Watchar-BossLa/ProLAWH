
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillGapRadarChart } from "./SkillGapRadarChart";
import { CareerPathFlowChart } from "./CareerPathFlowChart";
import { SkillProgressionChart } from "./SkillProgressionChart";
import { RecommendedSkillsHeatMap } from "./RecommendedSkillsHeatMap";
import { BarChart2, LineChart, RadarIcon, GitBranchIcon } from "lucide-react";

export function CareerVisualizationDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Career Visualization</h2>
      <p className="text-muted-foreground">
        Visualize your skill gaps, career progression, and recommended skills to acquire
      </p>
      
      <Tabs defaultValue="skillgap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skillgap" className="flex items-center gap-2">
            <RadarIcon className="h-4 w-4" />
            <span>Skill Gap Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="career-path" className="flex items-center gap-2">
            <GitBranchIcon className="h-4 w-4" />
            <span>Career Path</span>
          </TabsTrigger>
          <TabsTrigger value="progression" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Skill Progression</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Recommended Skills</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="skillgap" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <SkillGapRadarChart />
            </div>
            <div>
              <SkillProgressionChart />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="career-path">
          <CareerPathFlowChart />
        </TabsContent>
        
        <TabsContent value="progression">
          <div className="grid grid-cols-1 gap-4">
            <SkillProgressionChart />
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendedSkillsHeatMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
