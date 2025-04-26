
import { useParams } from "react-router-dom";
import { CourseDetails } from "@/components/learning/CourseDetails";

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  if (!courseId) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <CourseDetails courseId={courseId} />
    </div>
  );
}
