
import * as z from "zod";

export const formSchema = z.object({
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

export type FormData = z.infer<typeof formSchema>;
