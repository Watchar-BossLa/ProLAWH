
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorshipSchema, type MentorshipFormData } from "@/schemas/mentorship-schema";
import { MentorshipRequest, NetworkConnection } from "@/types/network";
import { toast } from "@/hooks/use-toast";

interface UseMentorshipFormProps {
  connection: NetworkConnection;
  onSubmit: (data: MentorshipRequest) => void;
  onClose: () => void;
}

export function useMentorshipForm({ connection, onSubmit, onClose }: UseMentorshipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MentorshipFormData>({
    resolver: zodResolver(mentorshipSchema),
    defaultValues: {
      message: "",
      focusAreas: "",
      industry: connection.industry || "",
      expectedDuration: "",
      goals: "",
    },
  });

  const handleSubmit = async (values: MentorshipFormData) => {
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

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
