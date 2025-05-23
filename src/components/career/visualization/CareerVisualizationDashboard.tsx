
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillGapRadarChart } from "./SkillGapRadarChart";
import { CareerPathFlowChart } from "./CareerPathFlowChart";
import { SkillProgressionChart } from "./SkillProgressionChart";
import { RecommendedSkillsHeatMap } from "./RecommendedSkillsHeatMap";
import { SkillNetworkGraph } from "./SkillNetworkGraph";
import { MarketValueComparison } from "./MarketValueComparison";
import { CareerTwinRecommendationSummary } from "./CareerTwinRecommendationSummary";
import { 
  BarChart2, LineChart, RadarIcon, GitBranchIcon, 
  Network, TrendingUp, Compass
} from "lucide-react";

export function CareerVisualizationDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Career Visualization</h2>
      <p className="text-muted-foreground">
        Interactive visualization of your skill ecosystem, career paths, and market demand insights
      </p>
      
      <CareerTwinRecommendationSummary className="mb-6" />
      
      <Tabs defaultValue="skill-ecosystem" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="skill-ecosystem" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span>Skill Ecosystem</span>
          </TabsTrigger>
          <TabsTrigger value="skillgap" className="flex items-center gap-2">
            <RadarIcon className="h-4 w-4" />
            <span>Gap Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="career-path" className="flex items-center gap-2">
            <GitBranchIcon className="h-4 w-4" />
            <span>Career Path</span>
          </TabsTrigger>
          <TabsTrigger value="progression" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Skills Trajectory</span>
          </TabsTrigger>
          <TabsTrigger value="market-value" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Market Value</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            <span>Personalized Roadmap</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="skill-ecosystem" className="space-y-4">
          <SkillNetworkGraph />
        </TabsContent>
        
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
        
        <TabsContent value="market-value">
          <MarketValueComparison />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <RecommendedSkillsHeatMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
