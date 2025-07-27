
import { Button } from "@/components/ui/button";
import { MentorshipResource } from "@/types/network";
import { MentorshipResourceItem } from "./MentorshipResourceItem";

interface MentorshipResourcesProps {
  resources?: MentorshipResource[];
  isOwnProfile?: boolean;
  isMentor?: boolean;
  onResourceClick: (resource: MentorshipResource) => void;
  onAddResource: () => void;
}

export function MentorshipResources({ 
  resources, 
  isOwnProfile, 
  isMentor,
  onResourceClick,
  onAddResource
}: MentorshipResourcesProps) {
  return (
    <div className="pt-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Resources</h4>
        {(isOwnProfile || isMentor) && (
          <Button variant="outline" size="sm" onClick={onAddResource}>
            Add Resource
          </Button>
        )}
      </div>
      
      {resources && resources.length > 0 ? (
        <div className="space-y-2">
          {resources.map((resource) => (
            <MentorshipResourceItem
              key={resource.id}
              resource={resource}
              onClick={() => onResourceClick(resource)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No resources added yet.</p>
      )}
    </div>
  );
}
