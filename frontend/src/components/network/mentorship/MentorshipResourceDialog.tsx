
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, Link } from "lucide-react";
import { MentorshipResource } from "@/types/network";
import { useState } from "react";

interface MentorshipResourceDialogProps {
  resource: MentorshipResource | null;
  onClose: () => void;
  onAddNote: (note: string) => void;
}

export function MentorshipResourceDialog({ 
  resource, 
  onClose,
  onAddNote 
}: MentorshipResourceDialogProps) {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote("");
  };

  if (!resource) return null;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{resource.title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Badge>{resource.type}</Badge>
        
        {resource.description && (
          <p className="text-sm">{resource.description}</p>
        )}
        
        {resource.url && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <Link className="h-4 w-4 mr-2" />
            Open Resource
          </Button>
        )}
        
        {!resource.completed && (
          <Button className="w-full">
            <Check className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-2">Add a note about this resource</h4>
          <Textarea 
            placeholder="Your thoughts or notes about this resource..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleAddNote} className="mt-2">Save Note</Button>
        </div>
      </div>
    </DialogContent>
  );
}
