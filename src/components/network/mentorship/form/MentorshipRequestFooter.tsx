
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MentorshipRequestFooterProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function MentorshipRequestFooter({ isSubmitting, onCancel }: MentorshipRequestFooterProps) {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Request"}
      </Button>
    </DialogFooter>
  );
}
