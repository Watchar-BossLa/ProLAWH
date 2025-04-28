
import { Badge } from "@/components/ui/badge";
import { FileText, Link, Video, BookOpen } from "lucide-react";
import { MentorshipResource } from "@/types/network";

interface MentorshipResourceItemProps {
  resource: MentorshipResource;
  onClick: (resource: MentorshipResource) => void;
}

export function MentorshipResourceItem({ resource, onClick }: MentorshipResourceItemProps) {
  const resourceTypeIcons = {
    'article': <FileText className="h-4 w-4" />,
    'video': <Video className="h-4 w-4" />,
    'book': <BookOpen className="h-4 w-4" />,
    'course': <FileText className="h-4 w-4" />,
    'tool': <Link className="h-4 w-4" />,
    'other': <Link className="h-4 w-4" />,
  };

  return (
    <div 
      className="p-3 border rounded-md flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onClick(resource)}
    >
      <div className="bg-muted rounded-md p-2">
        {resourceTypeIcons[resource.type]}
      </div>
      <div className="flex-1">
        <h5 className="font-medium text-sm">{resource.title}</h5>
        <p className="text-xs text-muted-foreground truncate">
          {resource.description || "Click to view details"}
        </p>
      </div>
      {resource.completed && (
        <Badge variant="outline" className="ml-auto">Completed</Badge>
      )}
    </div>
  );
}
