
import { Badge } from "@/components/ui/badge";
import { NetworkConnection } from "@/types/network";

interface NetworkCardMentorshipProps {
  connection: NetworkConnection;
}

export function NetworkCardMentorship({ connection }: NetworkCardMentorshipProps) {
  if (!connection.mentorship || connection.mentorship.status !== 'active') {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs font-semibold mb-1">Mentorship Focus Areas:</p>
      <div className="flex flex-wrap gap-1">
        {connection.mentorship.focusAreas.slice(0, 2).map((area, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {area}
          </Badge>
        ))}
        {connection.mentorship.focusAreas.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{connection.mentorship.focusAreas.length - 2}
          </Badge>
        )}
      </div>
      
      {connection.mentorship.nextMeetingDate && (
        <p className="text-xs mt-2">
          <span className="font-medium">Next Meeting:</span> {new Date(connection.mentorship.nextMeetingDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
