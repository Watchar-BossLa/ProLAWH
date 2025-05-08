
import { CourseModule } from "@/types/learning";
import { useCourseData } from "@/hooks/useCourseData";
import { useCourseInstructor } from "@/hooks/useCourseInstructor";
import { useCourseEnrollment } from "@/hooks/useCourseEnrollment";
import { useCourseReviewsList } from "@/hooks/useCourseReviewsList";
import { organizeContentIntoModules } from "@/utils/courseUtils";

export function useCourseDetails(courseId: string) {
  // Get course data and contents
  const { course, contents, isLoading: courseDataLoading } = useCourseData(courseId);
  
  // Get instructor information
  const { instructor, isLoading: instructorLoading } = useCourseInstructor(course?.created_by);
  
  // Get enrollment status
  const { enrollmentStatus, isLoading: enrollmentLoading } = useCourseEnrollment(courseId);
  
  // Get reviews
  const { reviews, averageRating, isLoading: reviewsLoading } = useCourseReviewsList(courseId);

  // Organize contents into modules
  const modules: CourseModule[] = contents ? organizeContentIntoModules(contents) : [];

  return {
    course,
    contents,
    modules,
    instructor,
    enrollmentStatus,
    reviews,
    averageRating,
    isLoading: courseDataLoading || instructorLoading || enrollmentLoading || reviewsLoading,
  };
}
