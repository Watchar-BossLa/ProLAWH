
import { useAuth } from "@/hooks/useAuth";
import { useLearningData } from "@/hooks/useLearningData";
import { CourseCard } from "@/components/learning/CourseCard";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LucideSchool, AlertCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function LearningDashboard() {
  const { user } = useAuth();
  const { courses, learningPaths, userEnrollments, isLoading } = useLearningData();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>Please log in to access the learning dashboard.</AlertDescription>
      </Alert>
    );
  }

  // Filter learning paths and courses by search query
  const filteredPaths = learningPaths?.filter(path => 
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get enrollment status for paths
  const getPathEnrollmentStatus = (pathId: string) => {
    const enrollment = userEnrollments?.find(
      (e) => e.learning_path_id === pathId
    );
    return enrollment
      ? { is_enrolled: true, progress_percentage: enrollment.progress_percentage || 0 }
      : { is_enrolled: false, progress_percentage: 0 };
  };

  // Count courses in each path
  const getPathCoursesCount = (pathId: string) => {
    return learningPaths?.find(p => p.id === pathId)?.courses?.length || 0;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <LucideSchool className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-muted-foreground">Explore our curated learning paths and specialized courses</p>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search learning paths and courses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="paths" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="courses">Individual Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[350px] rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {filteredPaths && filteredPaths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPaths.map((path) => (
                    <LearningPathCard 
                      key={path.id} 
                      path={path} 
                      enrollmentStatus={getPathEnrollmentStatus(path.id)}
                      coursesCount={getPathCoursesCount(path.id)}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No learning paths available</AlertTitle>
                  <AlertDescription>
                    {searchQuery ? "No learning paths match your search criteria." : "Please check back later for new content."}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[300px] rounded-lg" />
              ))
            ) : (
              filteredCourses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
            {!isLoading && (!filteredCourses || filteredCourses.length === 0) && (
              <div className="col-span-full">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No courses available</AlertTitle>
                  <AlertDescription>
                    {searchQuery ? "No courses match your search criteria." : "Please check back later for new courses."}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
