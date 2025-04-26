
import { useAuth } from "@/hooks/useAuth";
import { useLearningData } from "@/hooks/useLearningData";
import { CourseCard } from "@/components/learning/CourseCard";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LearningDashboard() {
  const { user } = useAuth();
  const { courses, learningPaths, isLoading } = useLearningData();

  if (!user) {
    return <div>Please log in to access the learning dashboard.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Learning Dashboard</h1>
      
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {courses?.length === 0 && (
              <p className="text-muted-foreground">No courses available.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paths">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths?.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
            {learningPaths?.length === 0 && (
              <p className="text-muted-foreground">No learning paths available.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
