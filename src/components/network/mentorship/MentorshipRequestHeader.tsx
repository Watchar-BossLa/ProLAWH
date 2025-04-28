
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NetworkConnection } from "@/types/network";

interface MentorshipRequestHeaderProps {
  connection: NetworkConnection;
}

export function MentorshipRequestHeader({ connection }: MentorshipRequestHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>Request Mentorship</DialogTitle>
      <DialogDescription>
        Send a mentorship request to {connection.name}. Be specific about what you'd like to learn.
      </DialogDescription>
    </DialogHeader>
  );
}
