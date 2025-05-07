import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCareerTwinMentorship } from "@/hooks/useCareerTwinMentorship";
import { MentorshipFormHeader } from "./form/MentorshipFormHeader";
import { MessageField } from "./form/fields/MessageField";
import { FocusAreasField } from "./form/fields/FocusAreasField";
import { IndustryField } from "./form/fields/IndustryField";
import { DurationField } from "./form/fields/DurationField";
import { GoalsField } from "./form/fields/GoalsField";
import { MentorshipFormActions } from "./form/MentorshipFormActions";
import { formSchema, type FormData } from "./form/schema";
import { useMentorship } from "@/hooks/useMentorship";
import { v4 as uuidv4 } from 'uuid';
import { MentorshipRequest } from "@/types/mocks";

interface MentorshipRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    expertise?: string[];
    recommendationId?: string;
  };
  onSuccess?: () => void;
}

export function MentorshipRequestForm({ 
  isOpen, 
  onClose, 
  mentor, 
  onSuccess 
}: MentorshipRequestFormProps) {
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
      const focusAreas = values.focusAreas.split(',').map(area => area.trim());
      
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
          goals: values.goals ? values.goals.split('\n').map(goal => goal.trim()) : undefined,
          createdAt: new Date().toISOString(),
          mentor_id: mentor.id, // For backward compatibility
          requester_id: "currentUser", // For backward compatibility
          focus_areas: focusAreas // For backward compatibility
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <MentorshipFormHeader 
          mentor={mentor} 
          isCareerTwinRecommended={!!mentor.recommendationId} 
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MessageField form={form} />
            <FocusAreasField form={form} />
            <IndustryField form={form} />
            <DurationField form={form} />
            <GoalsField form={form} />
            
            <MentorshipFormActions 
              isSubmitting={isSubmitting || mentorshipLoading}
              onCancel={onClose}
              submitError={submitError}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
