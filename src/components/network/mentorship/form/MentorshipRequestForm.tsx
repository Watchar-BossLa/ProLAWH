
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { MentorshipRequest, NetworkConnection } from "@/types/network";
import { MentorshipMessageField } from "./MentorshipMessageField";
import { MentorshipIndustryField } from "./MentorshipIndustryField";
import { useMentorshipForm } from "@/hooks/useMentorshipForm";
import { MentorshipRequestHeader } from "./MentorshipRequestHeader";
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
            <MentorshipIndustryField form={form} />
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
