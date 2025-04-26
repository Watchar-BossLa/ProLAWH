
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useEnrollment } from "@/hooks/useEnrollment";
import { book, list } from "lucide-react";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const { course, contents, isLoading } = useCourseDetails(courseId);
  const { enroll, isEnrolling } = useEnrollment();

  if (isLoading) {
    return <div>Loading course details...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground mt-2">{course.description}</p>
        </div>
        <Button 
          onClick={() => enroll({ courseId })}
          disabled={isEnrolling}
        >
          <book className="mr-2" />
          Enroll Now
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <list />
            Course Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contents?.length ? (
            <ul className="space-y-4">
              {contents.map((content) => (
                <li key={content.id} className="flex items-center gap-4">
                  <span className="text-muted-foreground">{content.order + 1}.</span>
                  <div>
                    <h3 className="font-medium">{content.title}</h3>
                    {content.description && (
                      <p className="text-sm text-muted-foreground">{content.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No content available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
