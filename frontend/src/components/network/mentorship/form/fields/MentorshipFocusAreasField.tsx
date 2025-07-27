
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MentorshipFormData } from "@/schemas/mentorship-schema";

interface MentorshipFocusAreasFieldProps {
  form: UseFormReturn<MentorshipFormData>;
}

export function MentorshipFocusAreasField({ form }: MentorshipFocusAreasFieldProps) {
  return (
    <FormField
      control={form.control}
      name="focusAreas"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Focus Areas</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g. Career Development, Technical Skills"
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
  );
}
