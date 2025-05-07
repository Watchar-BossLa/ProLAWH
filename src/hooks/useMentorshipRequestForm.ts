import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "@/components/mentorship/form/schema";
import { MentorshipRequest } from "@/types/mocks";
import { useMentorship } from "./useMentorship";
import { useCareerTwinMentorship } from "./useCareerTwinMentorship";
import { v4 as uuidv4 } from 'uuid';

interface UseMentorshipRequestFormProps {
  mentor: {
    id: string;
    name: string;
    expertise?: string[];
    recommendationId?: string;
  };
  onSuccess?: () => void;
  onClose: () => void;
}

export function useMentorshipRequestForm({
  mentor,
  onSuccess,
  onClose
}: UseMentorshipRequestFormProps) {
  const { sendMentorshipRequest, loading: mentorshipLoading } = useMentorship();
  const { requestMentorship } = useCareerTwinMentorship();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      focusAreas: mentor.expertise ? mentor.expertise.join(", ") : "",
      industry: "",
      expectedDuration: "",
      goals: ""
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Ensure focusAreas is a string before attempting to split
      const focusAreas = typeof values.focusAreas === 'string' 
        ? values.focusAreas.split(',').map(area => area.trim())
        : Array.isArray(values.focusAreas) ? values.focusAreas : [];
      
      // If we have a recommendation ID, use the Career Twin request method
      if (mentor.recommendationId) {
        await requestMentorship.mutateAsync({
          mentorId: mentor.id,
          message: values.message,
          focusAreas,
          industry: values.industry,
          recommendationId: mentor.recommendationId
        });
      } else {
        // Otherwise use the standard mentorship request with proper typing
        const request: MentorshipRequest = {
          id: uuidv4(),
          mentorId: mentor.id,
          requesterId: "currentUser", // This will be replaced with actual user ID in a real implementation
          message: values.message,
          status: "pending",
          focusAreas: focusAreas,
          industry: values.industry,
          expectedDuration: values.expectedDuration,
          goals: typeof values.goals === 'string' 
            ? values.goals.split('\n').map(goal => goal.trim())
            : [],
          createdAt: new Date().toISOString(),
          // For backward compatibility
          mentor_id: mentor.id,
          requester_id: "currentUser",
          focus_areas: focusAreas
        };
        
        await sendMentorshipRequest(request);
      }
      
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    submitError,
    isSubmitting,
    mentorshipLoading,
    handleSubmit: form.handleSubmit(onSubmit)
  };
}
