
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Brain } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageField } from "./fields/MessageField";
import { FocusAreasField } from "./fields/FocusAreasField";
import { IndustryField } from "./fields/IndustryField";
import { DurationField } from "./fields/DurationField";
import { GoalsField } from "./fields/GoalsField";
import { useMentorshipRequestForm } from "@/hooks/useMentorshipRequestForm";

interface MentorshipRequestFormCleanProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    expertise?: string[];
    recommendationId?: string;
  };
  onSuccess?: () => void;
}

export function MentorshipRequestFormClean({ 
  isOpen, 
  onClose, 
  mentor, 
  onSuccess 
}: MentorshipRequestFormCleanProps) {
  const {
    form,
    submitError,
    isSubmitting,
    mentorshipLoading,
    handleSubmit
  } = useMentorshipRequestForm({
    mentor,
    onSuccess,
    onClose
  });

  // Create initials for avatar fallback
  const initials = mentor.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
              {mentor.recommendationId && (
                <Badge variant="outline" className="flex w-fit items-center gap-1 mt-1">
                  <Brain className="h-3 w-3" />
                  <span className="text-xs">AI Recommended</span>
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription>
            Send a request to start a mentorship relationship with {mentor.name}.
            {mentor.recommendationId && " This mentor was recommended by your Career Twin based on your goals and skills."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <MessageField form={form} />
            <FocusAreasField form={form} />
            <IndustryField form={form} />
            <DurationField form={form} />
            <GoalsField form={form} />

            {/* Form Actions */}
            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || mentorshipLoading}>
                {isSubmitting || mentorshipLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : "Send Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
