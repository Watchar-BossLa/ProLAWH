
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { Progress } from "@/components/ui/progress";

type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"];

interface LearningPathCardProps {
  path: LearningPath;
  enrollmentStatus?: {
    is_enrolled: boolean;
    progress_percentage: number;
  };
  coursesCount?: number;
}

export function LearningPathCard({ path, enrollmentStatus, coursesCount = 0 }: LearningPathCardProps) {
  const isEnrolled = enrollmentStatus?.is_enrolled || false;
  const progress = enrollmentStatus?.progress_percentage || 0;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      {path.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={path.cover_image}
            alt={path.title}
            className="object-cover w-full h-full"
          />
          {isEnrolled && (
            <div className="absolute top-2 right-2">
              <Badge variant={progress === 100 ? "success" : "secondary"} className="text-xs">
                {progress === 100 ? "Completed" : `${progress}% Complete`}
              </Badge>
            </div>
          )}
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{path.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {path.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{path.estimated_duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{coursesCount} courses</span>
          </div>
        </div>
        
        {isEnrolled && progress > 0 && (
          <Progress value={progress} className="h-2" />
        )}
        
        <Button asChild className="w-full">
          <Link to={`/dashboard/learning/path/${path.id}`} className="flex items-center justify-center gap-2">
            {isEnrolled ? (
              <>
                {progress > 0 ? "Continue Learning" : "Start Learning"}
                <GraduationCap className="h-4 w-4" />
              </>
            ) : (
              <>
                View Path Details
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
