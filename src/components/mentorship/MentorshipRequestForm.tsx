
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useMentorship } from "@/hooks/useMentorship";
import { MentorshipFormHeader } from "./form/MentorshipFormHeader";
import { MessageField } from "./form/fields/MessageField";
import { FocusAreasField } from "./form/fields/FocusAreasField";
import { IndustryField } from "./form/fields/IndustryField";
import { DurationField } from "./form/fields/DurationField";
import { GoalsField } from "./form/fields/GoalsField";
import { MentorshipFormActions } from "./form/MentorshipFormActions";
import { formSchema, type FormData } from "./form/schema";

interface MentorshipRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    expertise?: string[];
  };
  onSuccess?: () => void;
}

export function MentorshipRequestForm({ 
  isOpen, 
  onClose, 
  mentor, 
  onSuccess 
}: MentorshipRequestFormProps) {
  const { sendMentorshipRequest, loading } = useMentorship();
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);
    
    const request = {
      mentor_id: mentor.id,
      message: values.message,
      focus_areas: values.focusAreas.split(',').map(area => area.trim()),
      industry: values.industry,
      expected_duration: values.expectedDuration,
      goals: values.goals ? values.goals.split('\n').map(goal => goal.trim()) : undefined,
    };
    
    const result = await sendMentorshipRequest(request);
    
    if (result) {
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setSubmitError("Failed to send request. Please try again.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <MentorshipFormHeader mentor={mentor} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <MessageField form={form} />
            <FocusAreasField form={form} />
            <IndustryField form={form} />
            <DurationField form={form} />
            <GoalsField form={form} />
            
            <MentorshipFormActions 
              isSubmitting={loading}
              onCancel={onClose}
              submitError={submitError}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
