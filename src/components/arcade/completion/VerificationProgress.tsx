
import { Progress } from "@/components/ui/progress";

interface VerificationProgressProps {
  isSubmitting: boolean;
  progress: number;
}

export function VerificationProgress({ isSubmitting, progress }: VerificationProgressProps) {
  if (!isSubmitting) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Verifying completion...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
