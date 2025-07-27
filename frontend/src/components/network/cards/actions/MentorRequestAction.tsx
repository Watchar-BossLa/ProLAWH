
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

interface MentorRequestActionProps {
  onMentorshipRequest: () => void;
  isHovered: boolean;
}

export function MentorRequestAction({ onMentorshipRequest, isHovered }: MentorRequestActionProps) {
  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="flex-1"
      onClick={onMentorshipRequest}
    >
      <Book size={16} />
      <span className="ml-1">Request Mentor</span>
    </Button>
  );
}
