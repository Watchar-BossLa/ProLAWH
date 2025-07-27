
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MentorshipFormData } from "@/schemas/mentorship-schema";

interface MentorshipMessageFieldProps {
  form: UseFormReturn<MentorshipFormData>;
}

export function MentorshipMessageField({ form }: MentorshipMessageFieldProps) {
  return (
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
  );
}
