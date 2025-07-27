
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, CheckIcon, XIcon } from "lucide-react";
import { formatRelative, format } from "date-fns";
import { useMentorship } from "@/hooks/useMentorship";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface MentorshipSessionCardProps {
  session: any;
  isMentor: boolean;
  onUpdate: () => void;
}

export function MentorshipSessionCard({ session, isMentor, onUpdate }: MentorshipSessionCardProps) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(5);
  const { updateSessionFeedback, loading } = useMentorship();

  const scheduledDate = new Date(session.scheduled_for);
  const isPast = scheduledDate < new Date();
  const isCompleted = session.status === 'completed';
  
  const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    rescheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  };
  
  const feedbackKey = isMentor ? 'mentor_feedback' : 'mentee_feedback';
  const ratingKey = isMentor ? 'mentor_rating' : 'mentee_rating';
  const hasFeedback = !!session[feedbackKey];
  
  const handleSaveFeedback = async () => {
    await updateSessionFeedback(
      session.id,
      'completed',
      isMentor,
      feedback,
      rating
    );
    setShowFeedbackDialog(false);
    onUpdate();
  };
  
  return (
    <>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Session {isCompleted ? "Summary" : "Details"}
            </CardTitle>
            <Badge className={statusColors[session.status] || ""}>
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{format(scheduledDate, 'EEEE, MMMM d, yyyy')}</p>
              <p className="text-xs text-muted-foreground">
                {format(scheduledDate, 'h:mm a')} · {formatRelative(scheduledDate, new Date())}
              </p>
            </div>
          </div>
          
          {session.duration_minutes && (
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span>{session.duration_minutes} minutes</span>
            </div>
          )}
          
          {session.notes && (
            <div>
              <p className="text-sm font-medium mb-1">Session Notes:</p>
              <p className="text-sm">{session.notes}</p>
            </div>
          )}
          
          {isCompleted && hasFeedback && (
            <div>
              <p className="text-sm font-medium mb-1">Your Feedback:</p>
              <p className="text-sm">{session[feedbackKey]}</p>
              {session[ratingKey] && (
                <div className="flex items-center mt-1">
                  <p className="text-xs mr-1">Rating:</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        className={`text-sm ${star <= session[ratingKey] ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          {isPast && !isCompleted ? (
            <Button 
              className="w-full"
              onClick={() => setShowFeedbackDialog(true)}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          ) : !isPast && !isCompleted ? (
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => updateSessionFeedback(session.id, 'cancelled', isMentor)}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="flex-1"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Reschedule
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Feedback</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="How was the session? What went well? What could be improved?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>
            
            <div>
              <Label>Rate this session</Label>
              <RadioGroup 
                defaultValue="5" 
                className="flex space-x-1 mt-1"
                onValueChange={(val) => setRating(parseInt(val))}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col items-center">
                    <RadioGroupItem 
                      value={value.toString()} 
                      id={`rating-${value}`}
                      className="sr-only"
                    />
                    <Label 
                      htmlFor={`rating-${value}`}
                      className={`text-2xl cursor-pointer ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </Label>
                    <span className="text-xs mt-1">{value}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFeedback} disabled={loading}>
                Save Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
