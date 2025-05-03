import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCareerTwinMentorship } from "@/hooks/useCareerTwinMentorship";
import { MentorshipFormHeader } from "./MentorshipFormHeader";
import { MessageField } from "./fields/MessageField";
import { FocusAreasField } from "./fields/FocusAreasField";
import { IndustryField } from "./fields/IndustryField";
import { DurationField } from "./fields/DurationField";
import { GoalsField } from "./fields/GoalsField";
import { MentorshipFormActions } from "./MentorshipFormActions";
import { formSchema, type FormData } from "./schema";
import { useMentorship } from "@/hooks/useMentorship";

interface MentorshipRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    expertise?: string[];
    recommendationId?: string; // Added recommendation ID
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
        // Otherwise use the standard mentorship request
        const request = {
          mentor_id: mentor.id,
          message: values.message,
          focus_areas: focusAreas,
          industry: values.industry,
          expected_duration: values.expectedDuration,
          goals: values.goals ? values.goals.split('\n').map(goal => goal.trim()) : undefined,
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
