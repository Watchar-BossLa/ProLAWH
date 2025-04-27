
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseHeader } from "@/components/learning/CourseHeader";
import { CourseModules } from "@/components/learning/CourseModules";
import { CourseReviews } from "@/components/learning/CourseReviews";
import { CourseNotes } from "@/components/learning/CourseNotes";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useCourseNotes } from "@/hooks/useCourseNotes";
import { useCourseReviews } from "@/hooks/useCourseReviews";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useCoursesWishlist } from "@/hooks/useCoursesWishlist";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const { course, contents, modules, instructor, enrollmentStatus, reviews, averageRating, isLoading } = useCourseDetails(courseId);
  const { enroll, isEnrolling } = useEnrollment();
  const { notes, saveNote, deleteNote } = useCourseNotes(courseId);
  const { submitReview, isSubmitting } = useCourseReviews(courseId);
  const { markContentAsCompleted } = useCourseProgress(courseId);
  const { isInWishlist, toggleWishlist, isPending: isWishlistPending } = useCoursesWishlist();
  
  const [selectedContentId, setSelectedContentId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("content");

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        <p className="font-medium">Course Not Found</p>
        <p className="text-sm">The requested course could not be found.</p>
      </div>
    );
  }

  const handleEnroll = () => {
    enroll({ courseId });
  };

  const handleContinueLearning = (contentId?: string) => {
    if (contentId) {
      setSelectedContentId(contentId);
      setActiveTab("content");
    }
  };

  const handleBookmark = () => {
    toggleWishlist(courseId);
  };

  const handleSelectContent = (contentId: string) => {
    setSelectedContentId(contentId);
    // If the content is in a preview mode, we might want to show it in a dialog
    // For now, we'll just mark it as selected
  };

  const handleCompleteContent = async () => {
    if (selectedContentId && enrollmentStatus?.is_enrolled) {
      await markContentAsCompleted(selectedContentId);
    }
  };

  const filteredNotes = selectedContentId
    ? notes.filter(note => note.content_id === selectedContentId)
    : notes;

  return (
    <div className="space-y-6">
      {/* Course Header with Cover Image, Enrollment Status */}
      <CourseHeader
        title={course.title}
        description={course.description || ""}
        coverImage={course.cover_image}
        estimatedDuration={course.estimated_duration}
        difficultyLevel={course.difficulty_level}
        instructor={instructor}
        enrollmentProgress={enrollmentStatus?.progress_percentage || 0}
        isEnrolled={enrollmentStatus?.is_enrolled || false}
        onEnroll={handleEnroll}
        onContinue={handleContinueLearning}
        onBookmark={handleBookmark}
        isEnrolling={isEnrolling || isWishlistPending}
        lastContentId={enrollmentStatus?.last_content_id}
      />

      {/* Course Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="content" className="flex-1">Course Content</TabsTrigger>
          <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-6">
          <CourseModules
            modules={modules}
            enrollmentStatus={enrollmentStatus}
            onSelectContent={handleSelectContent}
          />

          {selectedContentId && enrollmentStatus?.is_enrolled && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCompleteContent}>
                Mark as Completed
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <CourseNotes
            notes={filteredNotes}
            contentId={selectedContentId}
            onSaveNote={saveNote}
            onDeleteNote={deleteNote}
            isEnrolled={enrollmentStatus?.is_enrolled || false}
          />
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <CourseReviews
            reviews={reviews || []}
            averageRating={averageRating}
            isEnrolled={enrollmentStatus?.is_enrolled || false}
            onSubmitReview={submitReview}
            isSubmitting={isSubmitting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
