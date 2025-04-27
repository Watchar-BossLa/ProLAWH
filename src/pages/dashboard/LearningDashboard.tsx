
import { useAuth } from "@/hooks/useAuth";
import { useLearningData } from "@/hooks/useLearningData";
import { CourseCard } from "@/components/learning/CourseCard";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LucideSchool, AlertCircle } from "lucide-react";

export default function LearningDashboard() {
  const { user } = useAuth();
  const { courses, learningPaths, isLoading } = useLearningData();

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>Please log in to access the learning dashboard.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LucideSchool className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-muted-foreground">Explore our learning paths and courses</p>
        </div>
      </div>
      
      <Tabs defaultValue="paths" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="courses">Individual Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths?.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
              {learningPaths?.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No learning paths available</AlertTitle>
                  <AlertDescription>
                    Please check back later for new content.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-lg" />
              ))
            ) : (
              courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
            {!isLoading && courses?.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No courses available</AlertTitle>
                <AlertDescription>
                  Please check back later for new courses.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
