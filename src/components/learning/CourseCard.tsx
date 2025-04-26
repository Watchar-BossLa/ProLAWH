
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {course.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={course.cover_image}
            alt={course.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available"}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm bg-secondary px-2 py-1 rounded">
            {course.difficulty_level}
          </span>
          {course.estimated_duration && (
            <span className="text-sm text-muted-foreground">
              {course.estimated_duration}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
