
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Leaf } from "lucide-react";
import { CarbonFootprintCalculator } from '@/components/skills/CarbonFootprintCalculator';
import { SDGAlignmentChart } from '@/components/skills/SDGAlignmentChart';
import { ImpactVisualization } from '@/components/skills/ImpactVisualization';
import { EnvironmentalAchievements } from '@/components/skills/achievements/EnvironmentalAchievements';

export function ImpactTabContent() {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CarbonFootprintCalculator />
        <SDGAlignmentChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ImpactVisualization />
        <EnvironmentalAchievements />
      </div>
    </div>
  );
}
