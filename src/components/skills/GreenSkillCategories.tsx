
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GreenSkillCategoriesProps {
  skills: Array<{
    category: string;
    name: string;
    co2_reduction_potential: number;
    market_growth_rate: number;
  }>;
}

export function GreenSkillCategories({ skills }: GreenSkillCategoriesProps) {
  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {Object.entries(categories).map(([category, categorySkills]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-sm">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge 
                      key={skill.name} 
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {skill.name}
                      <span className="text-xs text-muted-foreground">
                        ({skill.market_growth_rate}% growth)
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
