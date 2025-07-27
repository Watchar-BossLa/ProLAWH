
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { MentorshipProgress as IMentorshipProgress } from "@/types/network";

interface MentorshipProgressProps {
  progress?: IMentorshipProgress[];
}

export function MentorshipProgress({ progress }: MentorshipProgressProps) {
  const calculateProgress = () => {
    if (!progress || progress.length === 0) return 0;
    const completedCount = progress.filter(p => p.completed).length;
    return Math.round((completedCount / progress.length) * 100);
  };

  const progressPercentage = calculateProgress();

  if (!progress || progress.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Progress</h4>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
