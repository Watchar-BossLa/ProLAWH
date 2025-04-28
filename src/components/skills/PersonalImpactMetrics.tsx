
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, Target, TrendingUp } from "lucide-react";

interface PersonalImpactMetricsProps {
  carbonReduction: number;
  skillsAcquired: number;
  marketGrowth: number;
}

export function PersonalImpactMetrics({ 
  carbonReduction, 
  skillsAcquired, 
  marketGrowth 
}: PersonalImpactMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Your Green Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Carbon Reduction Potential</span>
            <span className="font-medium">{carbonReduction}%</span>
          </div>
          <Progress value={carbonReduction} className="h-2" />
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <Leaf className="h-3 w-3 mr-1" />
            Top 10% in your industry
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Green Skills Acquired</span>
            <span className="font-medium">{skillsAcquired}</span>
          </div>
          <Progress value={(skillsAcquired / 10) * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Market Growth Rate</span>
            <span className="font-medium">{marketGrowth}%</span>
          </div>
          <Progress value={marketGrowth} className="h-2" />
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <TrendingUp className="h-3 w-3 mr-1" />
            High demand skills
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
