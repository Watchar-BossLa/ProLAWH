
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"];

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      {path.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={path.cover_image}
            alt={path.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{path.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {path.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>{path.estimated_duration}</span>
        </div>
        <Button asChild className="w-full">
          <Link to={`/dashboard/learning/path/${path.id}`} className="flex items-center justify-center gap-2">
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
