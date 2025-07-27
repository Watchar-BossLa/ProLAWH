
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Sprout, Wind } from "lucide-react";

export function GreenSkillsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sustainability Impact</CardTitle>
          <Leaf className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            Green skills are crucial for sustainable development and environmental protection.
          </p>
          <div className="text-2xl font-bold text-green-600">High Impact</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Demand</CardTitle>
          <Wind className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            Growing demand for professionals with environmental expertise.
          </p>
          <div className="text-2xl font-bold text-blue-600">Rising</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Future Growth</CardTitle>
          <Sprout className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            Projected growth in green skill opportunities.
          </p>
          <div className="text-2xl font-bold text-emerald-600">Expanding</div>
        </CardContent>
      </Card>
    </div>
  );
}
