
import { Calendar } from "lucide-react";

interface MentorshipDatesProps {
  startDate?: string;
  meetingFrequency?: string;
}

export function MentorshipDates({ startDate, meetingFrequency }: MentorshipDatesProps) {
  if (!startDate && !meetingFrequency) return null;
  
  return (
    <>
      {startDate && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Started on {new Date(startDate).toLocaleDateString()}
          </span>
        </div>
      )}
      
      {meetingFrequency && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Meeting {meetingFrequency}
          </span>
        </div>
      )}
    </>
  );
}
