import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCareerTwinMentorship } from "@/hooks/useCareerTwinMentorship";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2 } from "lucide-react";
import { useMentorship } from "@/hooks/useMentorship";
import { v4 as uuidv4 } from 'uuid';
import { MentorshipRequest } from "@/types/mocks";
import * as z from "zod";

// Define the schema for form validation
const formSchema = z.object({
  message: z.string().min(10, {
    message: "Your message must be at least 10 characters."
  }),
  focusAreas: z.string().min(1, {
    message: "Please enter at least one focus area."
  }),
  industry: z.string().min(1, {
    message: "Please select an industry."
  }),
  expectedDuration: z.string().optional(),
  goals: z.string().optional()
});

// Type for form data
type FormData = z.infer<typeof formSchema>;

interface MentorshipRequestFormProps {
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

export function MentorshipRequestForm({ 
  isOpen, 
  onClose, 
  mentor, 
  onSuccess 
}: MentorshipRequestFormProps) {
  const { sendMentorshipRequest, loading: mentorshipLoading } = useMentorship();
  const { requestMentorship } = useCareerTwinMentorship();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      focusAreas: mentor.expertise ? mentor.expertise.join(", ") : "",
      industry: "",
      expectedDuration: "",
      goals: ""
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Ensure focusAreas is a string before attempting to split
      const focusAreas = typeof values.focusAreas === 'string' 
        ? values.focusAreas.split(',').map(area => area.trim())
        : Array.isArray(values.focusAreas) ? values.focusAreas : [];
      
      // If we have a recommendation ID, use the Career Twin request method
      if (mentor.recommendationId) {
        await requestMentorship.mutateAsync({
          mentorId: mentor.id,
          message: values.message,
          focusAreas,
          industry: values.industry,
          recommendationId: mentor.recommendationId
        });
      } else {
        // Otherwise use the standard mentorship request with proper typing
        const request: MentorshipRequest = {
          id: uuidv4(),
          mentorId: mentor.id,
          requesterId: "currentUser", // This will be replaced with actual user ID in a real implementation
          message: values.message,
          status: "pending",
          focusAreas: focusAreas,
          industry: values.industry,
          expectedDuration: values.expectedDuration,
          goals: typeof values.goals === 'string' 
            ? values.goals.split('\n').map(goal => goal.trim())
            : [],
          createdAt: new Date().toISOString(),
          // For backward compatibility
          mentor_id: mentor.id,
          requester_id: "currentUser",
          focus_areas: focusAreas
        };
        
        await sendMentorshipRequest(request);
      }
      
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why you want to be mentored and what you hope to achieve"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Focus Areas Field */}
            <FormField
              control={form.control}
              name="focusAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Areas</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Career Development, Leadership, Technical Skills"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate multiple focus areas with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Industry Field */}
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration Field */}
            <FormField
              control={form.control}
              name="expectedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Duration</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goals Field */}
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List specific goals you'd like to achieve (one per line)"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    List one goal per line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
