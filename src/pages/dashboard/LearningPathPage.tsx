
import { useParams } from "react-router-dom";
import { useLearningPathDetails } from "@/hooks/useLearningPathDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CourseCard } from "@/components/learning/CourseCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEnrollment } from "@/hooks/useEnrollment";
import { toast } from "sonner";

export default function LearningPathPage() {
  const { pathId } = useParams();
  const { learningPath, courses, enrollmentStatus, isLoading, error } = useLearningPathDetails(pathId);
  const { enroll, isEnrolling } = useEnrollment();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !learningPath) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Learning Path</AlertTitle>
        <AlertDescription>
          {error || "The requested learning path could not be found."}
        </AlertDescription>
      </Alert>
    );
  }

  const handleEnroll = () => {
    if (pathId) {
      enroll({ learningPathId: pathId })
        .then(() => {
          toast.success("Successfully enrolled in learning path");
        })
        .catch((error) => {
          toast.error(`Failed to enroll: ${error.message}`);
        });
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link to="/dashboard/learning" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Learning Dashboard
        </Link>
      </Button>

      {/* Learning Path Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{learningPath.title}</h1>
            <p className="text-muted-foreground mt-2">{learningPath.description}</p>
          </div>
          
          {enrollmentStatus?.is_enrolled ? (
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2">
                {enrollmentStatus.progress_percentage}% Complete
              </Badge>
              <Progress value={enrollmentStatus.progress_percentage} className="w-full md:w-64 h-2" />
            </div>
          ) : (
            <Button 
              onClick={handleEnroll} 
              disabled={isEnrolling}
              className="w-full md:w-auto"
            >
              {isEnrolling ? "Enrolling..." : "Enroll Now"}
            </Button>
          )}
        </div>

        {/* Learning Path Info */}
        {learningPath.cover_image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={learningPath.cover_image}
              alt={learningPath.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{learningPath.estimated_duration}</span>
          <span>|</span>
          <span>{courses?.length || 0} Courses</span>
        </div>
      </div>

      {/* Courses in Learning Path */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Courses in this Learning Path</h2>
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No courses available</AlertTitle>
            <AlertDescription>
              This learning path doesn't have any courses yet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
