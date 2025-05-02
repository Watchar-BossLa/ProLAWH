
import { Button } from "@/components/ui/button";
import { HandshakeIcon } from "lucide-react";

interface RelationshipToolsActionProps {
  connectionType: 'mentor' | 'peer' | 'colleague';
  onShowTools: () => void;
  isHovered: boolean;
}

export function RelationshipToolsAction({ 
  connectionType, 
  onShowTools, 
  isHovered 
}: RelationshipToolsActionProps) {
  const getToolLabel = () => {
    switch(connectionType) {
      case 'mentor': return 'Mentorship Tools';
      case 'peer': return 'Collaboration Tools';
      case 'colleague': return 'Professional Tools';
      default: return 'Relationship Tools';
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="flex-1"
      onClick={onShowTools}
    >
      <HandshakeIcon size={16} />
      <span className="ml-1">{getToolLabel()}</span>
    </Button>
  );
}
