
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
}

interface GreenSkillsLearningPathProps {
  recommendations: LearningPathItem[];
}

export function GreenSkillsLearningPath({ recommendations }: GreenSkillsLearningPathProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Recommended Learning Paths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {recommendations.map((path) => (
              <Card key={path.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{path.title}</h4>
                      <p className="text-sm text-muted-foreground">{path.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {path.duration}
                        </span>
                        <span>{path.level}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dashboard/learning/path/${path.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
