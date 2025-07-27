
import { Check } from "lucide-react";

interface MentorshipGoalsProps {
  goals?: string[];
}

export function MentorshipGoals({ goals }: MentorshipGoalsProps) {
  if (!goals || goals.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Goals</h4>
      <ul className="space-y-1">
        {goals.map((goal, i) => (
          <li key={i} className="text-sm flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <span>{goal}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
