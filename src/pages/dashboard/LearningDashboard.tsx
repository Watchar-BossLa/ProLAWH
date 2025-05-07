
import { useAuth } from "@/hooks/useAuth";
import { useLearningData } from "@/hooks/useLearningData";
import { CourseCard } from "@/components/learning/CourseCard";
import { LearningPathDetails } from "@/components/learning/LearningPathDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LucideSchool, AlertCircle } from "lucide-react";
import { MockData } from "@/types/mocks";

// Helper type for LearningPath
interface LearningPath {
  id: string;
  title?: string;
  description?: string;
  cover_image?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  estimated_duration?: string;
  is_published?: boolean;
  difficulty_level?: string;
  [key: string]: any; // Allow for other properties
}

// Helper type for Course
interface Course {
  id: string;
  title?: string;
  description?: string;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for other properties
}

export default function LearningDashboard() {
  const { user } = useAuth();
  const { featuredCourses, learningPaths, isLoading } = useLearningData();

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>Please log in to access the learning dashboard.</AlertDescription>
      </Alert>
    );
  }

  // Cast the learning paths and courses to proper types
  const typedLearningPaths = learningPaths?.map((path: MockData | { id: string; name: string }) => {
    return path as unknown as LearningPath;
  });

  const typedFeaturedCourses = featuredCourses?.map((course: MockData | { id: string; name: string }) => {
    return course as unknown as Course;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LucideSchool className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-muted-foreground">Explore our curated learning paths and specialized courses</p>
        </div>
      </div>
      
      <Tabs defaultValue="paths" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="courses">Individual Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[400px] rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {typedLearningPaths?.map((path) => (
                <LearningPathDetails key={path.id} path={path as any} />
              ))}
              {typedLearningPaths?.length === 0 && (
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
              typedFeaturedCourses?.map((course) => (
                <CourseCard key={course.id} course={course as any} />
              ))
            )}
            {!isLoading && typedFeaturedCourses?.length === 0 && (
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
