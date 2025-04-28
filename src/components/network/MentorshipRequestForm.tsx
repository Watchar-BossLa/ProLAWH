
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MentorshipRequest, NetworkConnection } from "@/types/network";
import { MentorshipMessageField } from "./mentorship/MentorshipMessageField";
import { MentorshipIndustryField } from "./mentorship/MentorshipIndustryField";
import { useMentorshipForm } from "@/hooks/useMentorshipForm";

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
        <DialogHeader>
          <DialogTitle>Request Mentorship</DialogTitle>
          <DialogDescription>
            Send a mentorship request to {connection.name}. Be specific about what you'd like to learn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <MentorshipMessageField form={form} />
            <MentorshipIndustryField form={form} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
