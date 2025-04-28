
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMentorship } from "@/hooks/useMentorship";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface MentorshipRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    expertise?: string[];
  };
  onSuccess?: () => void;
}

export function MentorshipRequestForm({ isOpen, onClose, mentor, onSuccess }: MentorshipRequestFormProps) {
  const { sendMentorshipRequest, loading } = useMentorship();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
      focusAreas: mentor.expertise ? mentor.expertise.join(", ") : "",
      industry: "",
      expectedDuration: "",
      goals: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError(null);
    
    const request = {
      mentor_id: mentor.id,
      message: values.message,
      focus_areas: values.focusAreas.split(',').map(area => area.trim()),
      industry: values.industry,
      expected_duration: values.expectedDuration,
      goals: values.goals ? values.goals.split('\n').map(goal => goal.trim()) : undefined,
    };
    
    const result = await sendMentorshipRequest(request);
    
    if (result) {
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setSubmitError("Failed to send request. Please try again.");
    }
  }

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
          <DialogTitle>Request Mentorship</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            {mentor.avatar ? (
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-medium">{mentor.name}</p>
            <p className="text-xs text-muted-foreground">Potential Mentor</p>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
