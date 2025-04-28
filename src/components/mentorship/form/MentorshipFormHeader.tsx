
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MentorshipFormHeaderProps {
  mentor: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function MentorshipFormHeader({ mentor }: MentorshipFormHeaderProps) {
  const initials = mentor.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Request Mentorship</DialogTitle>
      </DialogHeader>
      
      <div className="flex items-center gap-3 mb-4">
        <Avatar>
          {mentor.avatar ? (
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{mentor.name}</p>
          <p className="text-xs text-muted-foreground">Potential Mentor</p>
        </div>
      </div>
    </>
  );
}
