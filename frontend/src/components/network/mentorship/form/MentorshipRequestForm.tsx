
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
    onSubmit,
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
