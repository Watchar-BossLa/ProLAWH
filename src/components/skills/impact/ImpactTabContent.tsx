
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Leaf, Briefcase, Sun } from "lucide-react";
import { ImpactVisualization } from '@/components/skills/ImpactVisualization';
import { CarbonFootprintCalculator } from '@/components/skills/CarbonFootprintCalculator';
import { SDGAlignmentChart } from '@/components/skills/SDGAlignmentChart';

interface ImpactTabContentProps {
  environmentalImpact: any[];
  sdgData: any[];
}

export function ImpactTabContent({ environmentalImpact, sdgData }: ImpactTabContentProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CarbonFootprintCalculator />
        <SDGAlignmentChart sdgData={sdgData} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ImpactVisualization 
          environmentalImpact={environmentalImpact}
          totalReduction={environmentalImpact.reduce((sum, item) => sum + item.value, 0)}
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
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-xs text-center">Carbon Reducer</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Briefcase className="h-8 w-8 text-blue-600" />
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
    </div>
  );
}
