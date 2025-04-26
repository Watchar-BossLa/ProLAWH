
import { useParams } from "react-router-dom";
import { CourseDetails } from "@/components/learning/CourseDetails";
import { useAuth } from "@/hooks/useAuth";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded">
          <p className="font-medium">Authentication Required</p>
          <p className="text-sm">Please sign in to view course details.</p>
        </div>
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-medium">Course Not Found</p>
          <p className="text-sm">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <CourseDetails courseId={courseId} />
    </div>
  );
}
