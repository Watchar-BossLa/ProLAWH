
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMentorship } from "@/hooks/useMentorship";
import { useState } from "react";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date for the session.",
  }),
  time: z.string().min(1, {
    message: "Please select a time for the session.",
  }),
  duration: z.number({
    required_error: "Please enter the duration.",
    invalid_type_error: "Duration must be a number.",
  }).min(15, {
    message: "Duration must be at least 15 minutes.",
  }).max(180, {
    message: "Duration cannot exceed 3 hours (180 minutes).",
  }),
  notes: z.string().optional(),
});

interface MentorshipSessionFormProps {
  isOpen: boolean;
  onClose: () => void;
  relationshipId: string;
  onSuccess?: () => void;
}

export function MentorshipSessionForm({ isOpen, onClose, relationshipId, onSuccess }: MentorshipSessionFormProps) {
  const { scheduleMentorshipSession, loading } = useMentorship();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      time: "12:00",
      duration: 60,
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError(null);
    
    // Combine date and time
    const [hours, minutes] = values.time.split(':').map(Number);
    const scheduledFor = new Date(values.date);
    scheduledFor.setHours(hours, minutes, 0, 0);
    
    // Don't allow scheduling in the past
    if (scheduledFor < new Date()) {
      setSubmitError("Cannot schedule sessions in the past.");
      return;
    }
    
    const result = await scheduleMentorshipSession(
      relationshipId,
      scheduledFor,
      values.duration,
      values.notes
    );
    
    if (result) {
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setSubmitError("Failed to schedule session. Please try again.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Mentorship Session</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Session Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the session duration in minutes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this session"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling...
                  </>
                ) : "Schedule Session"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
