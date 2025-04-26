
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MentorshipRequest, NetworkConnection } from "@/types/network";
import { toast } from "@/hooks/use-toast";

const mentorshipSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(500),
  focusAreas: z.string().min(3, "Please specify at least one focus area"),
  industry: z.string().min(1, "Please select an industry"),
  expectedDuration: z.string().optional(),
  goals: z.string().optional(),
});

interface MentorshipRequestFormProps {
  connection: NetworkConnection;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MentorshipRequest) => void;
}

export function MentorshipRequestForm({
  connection,
  isOpen,
  onClose,
  onSubmit,
}: MentorshipRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof mentorshipSchema>>({
    resolver: zodResolver(mentorshipSchema),
    defaultValues: {
      message: "",
      focusAreas: "",
      industry: connection.industry || "",
      expectedDuration: "",
      goals: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof mentorshipSchema>) => {
    setIsSubmitting(true);
    try {
      const request: MentorshipRequest = {
        id: `request-${Date.now()}`,
        requesterId: "currentUser",
        mentorId: connection.id,
        message: values.message,
        status: "pending",
        createdAt: new Date().toISOString(),
        focusAreas: values.focusAreas.split(",").map(area => area.trim()),
        industry: values.industry,
        expectedDuration: values.expectedDuration,
        goals: values.goals ? values.goals.split(",").map(goal => goal.trim()) : undefined,
      };

      onSubmit(request);
      form.reset();
      toast({
        title: "Mentorship Request Sent",
        description: "Your request has been sent successfully!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send mentorship request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Marketing",
    "Design",
    "Law",
    "Engineering",
    "Science",
    "Arts",
    "Entertainment",
    "Hospitality",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Mentorship</DialogTitle>
          <DialogDescription>
            Send a mentorship request to {connection.name}. Be specific about what you'd like to learn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why you'd like this person to mentor you..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly introduce yourself and why you're interested in being mentored.
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
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      placeholder="e.g. React, Leadership, Project Management" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of skills or topics you want to focus on
                  </FormDescription>
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
                        <SelectValue placeholder="How long would you like to be mentored?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
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
                  <FormLabel>Goals</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What specific goals do you want to achieve?" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Separate multiple goals with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
