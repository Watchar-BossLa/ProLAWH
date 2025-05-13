
import { Button } from "@/components/ui/button";

interface CompletionFooterProps {
  onReset: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isCredentialIssuing: boolean;
  isSuccess: boolean;
}

export function CompletionFooter({
  onReset,
  onSubmit,
  isSubmitting,
  isCredentialIssuing,
  isSuccess
}: CompletionFooterProps) {
  const isDisabled = isSubmitting || isCredentialIssuing;
  
  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      <Button 
        variant="outline" 
        className="flex-1" 
        onClick={onReset}
        disabled={isDisabled}
      >
        Try Again
      </Button>
      
      <Button 
        className="flex-1" 
        onClick={onSubmit}
        disabled={isDisabled}
      >
        {isSubmitting 
          ? "Submitting..." 
          : isCredentialIssuing 
            ? "Issuing Credential..." 
            : isSuccess 
              ? "Return to Arcade" 
              : "Submit Results"}
      </Button>
    </div>
  );
}
