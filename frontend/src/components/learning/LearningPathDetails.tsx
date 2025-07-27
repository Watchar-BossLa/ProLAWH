
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"] & {
  courses: Database["public"]["Tables"]["courses"]["Row"][];
};

interface LearningPathDetailsProps {
  path: LearningPath;
}

export function LearningPathDetails({ path }: LearningPathDetailsProps) {
  return (
    <Card className="flex flex-col">
      {path.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={path.cover_image}
            alt={path.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{path.title}</CardTitle>
        <CardDescription>{path.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4" />
          <span>{path.estimated_duration}</span>
          <BookOpen className="h-4 w-4 ml-2" />
          <span>{path.courses?.length || 0} courses</span>
        </div>

        {path.courses && path.courses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Included Courses:</h4>
            <ul className="space-y-2">
              {path.courses.map((course) => (
                <li key={course.id} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {course.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button asChild className="w-full mt-6">
          <Link to={`/dashboard/learning/path/${path.id}`} className="flex items-center justify-center gap-2">
            View Path Details <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
