
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

interface MentorshipFormHeaderProps {
  mentor: {
    name: string;
    avatar?: string;
    expertise?: string[];
    recommendationId?: string;
  };
  isCareerTwinRecommended?: boolean;
}

export function MentorshipFormHeader({ mentor, isCareerTwinRecommended }: MentorshipFormHeaderProps) {
  const initials = mentor.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <DialogHeader>
      <div className="flex items-center gap-4 mb-1">
        <Avatar className="h-12 w-12">
          {mentor.avatar ? (
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <DialogTitle>{mentor.name}</DialogTitle>
          {isCareerTwinRecommended && (
            <Badge variant="outline" className="flex w-fit items-center gap-1 mt-1">
              <Brain className="h-3 w-3" />
              <span className="text-xs">AI Recommended</span>
            </Badge>
          )}
        </div>
      </div>
      <DialogDescription>
        Send a request to start a mentorship relationship with {mentor.name}.
        {isCareerTwinRecommended && " This mentor was recommended by your Career Twin based on your goals and skills."}
      </DialogDescription>
    </DialogHeader>
  );
}
