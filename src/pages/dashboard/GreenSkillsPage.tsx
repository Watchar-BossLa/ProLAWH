
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GreenSkillsList } from "@/components/skills/GreenSkillsList";
import { GreenSkillStats } from "@/components/skills/GreenSkillStats";
import { Leaf } from "lucide-react";

export default function GreenSkillsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Green Skills Index</h2>
        <p className="text-muted-foreground">
          Track and develop sustainable skills for the future of work
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Green Skills</CardTitle>
            <Leaf className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <GreenSkillStats />
          </CardContent>
        </Card>
      </div>

      <GreenSkillsList />
    </div>
  );
}
