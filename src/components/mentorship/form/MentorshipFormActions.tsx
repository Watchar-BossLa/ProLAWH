
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MentorshipFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitError: string | null;
}

export function MentorshipFormActions({ 
  isSubmitting, 
  onCancel, 
  submitError 
}: MentorshipFormActionsProps) {
  return (
    <>
      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : "Send Request"}
        </Button>
      </div>
    </>
  );
}
