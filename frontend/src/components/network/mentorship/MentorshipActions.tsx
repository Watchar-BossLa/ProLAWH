
import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";

interface MentorshipActionsProps {
  status: string;
}

export function MentorshipActions({ status }: MentorshipActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between">
      <Button 
        variant={status === 'active' ? "default" : "outline"}
        size="sm"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Schedule Meeting
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
      >
        <FileText className="h-4 w-4 mr-2" />
        Add Progress Note
      </Button>
    </div>
  );
}
