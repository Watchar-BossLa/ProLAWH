
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { UserNote } from "@/types/learning";
import { MessageSquare, Save, Trash } from "lucide-react";
import { useState } from "react";

interface CourseNotesProps {
  notes: UserNote[];
  contentId?: string;
  onSaveNote: (contentId: string, note: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  isEnrolled: boolean;
}

export function CourseNotes({
  notes,
  contentId,
  onSaveNote,
  onDeleteNote,
  isEnrolled
}: CourseNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const handleSaveNote = async () => {
    if (!contentId || !newNote.trim()) return;
    
    try {
      setIsSaving(true);
      await onSaveNote(contentId, newNote);
      setNewNote('');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    try {
      setIsDeleting(noteId);
      await onDeleteNote(noteId);
    } finally {
      setIsDeleting(null);
    }
  };
  
  if (!isEnrolled) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare size={18} />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="resize-none"
              rows={3}
              disabled={!contentId}
            />
            <div className="flex justify-end mt-2">
              <Button 
                onClick={handleSaveNote} 
                disabled={!newNote.trim() || isSaving || !contentId}
                size="sm"
              >
                <Save size={14} className="mr-1" />
                Save Note
              </Button>
            </div>
          </div>
          
          {notes.length > 0 ? (
            <div className="space-y-3 mt-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-muted p-3 rounded-md relative group">
                  <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(note.created_at).toLocaleString()}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteNote(note.id)}
                    disabled={isDeleting === note.id}
                  >
                    <Trash size={14} className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            contentId && (
              <div className="text-center py-4 text-muted-foreground">
                No notes yet. Add one to help remember key points!
              </div>
            )
          )}
          
          {!contentId && (
            <div className="text-center py-4 text-muted-foreground">
              Select a course content to add notes.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
