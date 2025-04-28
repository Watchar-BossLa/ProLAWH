
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

interface MentorshipGoalsFieldProps {
  form: UseFormReturn<MentorshipFormData>;
}

export function MentorshipGoalsField({ form }: MentorshipGoalsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="goals"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Goals</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="List your specific goals for this mentorship (one per line)"
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
  );
}
