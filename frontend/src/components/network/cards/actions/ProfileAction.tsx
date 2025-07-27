
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileActionProps {
  connectionId: string;
  isHovered: boolean;
}

export function ProfileAction({ connectionId, isHovered }: ProfileActionProps) {
  const navigate = useNavigate();
  
  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="flex-1"
      onClick={() => navigate(`/dashboard/network/${connectionId}`)}
    >
      <Users size={16} />
      <span className="ml-1">Profile</span>
    </Button>
  );
}
