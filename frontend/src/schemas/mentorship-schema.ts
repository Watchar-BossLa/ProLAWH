
import * as z from "zod";

export const mentorshipSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(500),
  focusAreas: z.string().min(3, "Please specify at least one focus area"),
  industry: z.string().min(1, "Please select an industry"),
  expectedDuration: z.string().optional(),
  goals: z.string().optional(),
});

export type MentorshipFormData = z.infer<typeof mentorshipSchema>;
