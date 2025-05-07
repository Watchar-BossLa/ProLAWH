
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NetworkConnection, MentorshipRequest } from "@/types/network";
import { useMentorshipForm } from "@/hooks/useMentorshipForm";
import { MentorshipRequestHeader } from "./MentorshipRequestHeader";
import { MentorshipMessageField } from "./MentorshipMessageField";
import { MentorshipIndustryField } from "./MentorshipIndustryField";
import { MentorshipFocusAreasField } from "./fields/MentorshipFocusAreasField";
import { MentorshipDurationField } from "./fields/MentorshipDurationField";
import { MentorshipGoalsField } from "./fields/MentorshipGoalsField";
import { MentorshipRequestFooter } from "./MentorshipRequestFooter";
import { v4 as uuidv4 } from 'uuid';

interface MentorshipRequestFormProps {
  connection: NetworkConnection;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MentorshipRequest) => void;
}

export function MentorshipRequestForm({
  connection,
  isOpen,
  onClose,
  onSubmit,
}: MentorshipRequestFormProps) {
  const { form, isSubmitting, handleSubmit } = useMentorshipForm({
    connection,
    onSubmit: (formData) => {
      // Transform form data to match MentorshipRequest interface
      const request: MentorshipRequest = {
        id: uuidv4(),
        mentorId: connection.id,
        requesterId: "currentUser", // This will be replaced with actual user ID in a real implementation
        message: formData.message,
        status: "pending",
        focusAreas: formData.focusAreas.split(',').map(area => area.trim()),
        industry: formData.industry,
        expectedDuration: formData.expectedDuration,
        goals: formData.goals ? formData.goals.split(',').map(goal => goal.trim()) : undefined,
        createdAt: new Date().toISOString(),
        // For backward compatibility
        mentor_id: connection.id,
        requester_id: "currentUser",
        focus_areas: formData.focusAreas.split(',').map(area => area.trim())
      };
      onSubmit(request);
    },
    onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <MentorshipRequestHeader connection={connection} />
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <MentorshipMessageField form={form} />
            <MentorshipFocusAreasField form={form} />
            <MentorshipIndustryField form={form} />
            <MentorshipDurationField form={form} />
            <MentorshipGoalsField form={form} />
            <MentorshipRequestFooter 
              isSubmitting={isSubmitting}
              onCancel={onClose}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
