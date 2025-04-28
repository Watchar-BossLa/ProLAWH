
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MentorshipFormData } from "@/schemas/mentorship-schema";
import { DURATIONS } from "@/constants/mentorship";

interface MentorshipDurationFieldProps {
  form: UseFormReturn<MentorshipFormData>;
}

export function MentorshipDurationField({ form }: MentorshipDurationFieldProps) {
  return (
    <FormField
      control={form.control}
      name="expectedDuration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expected Duration</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {DURATIONS.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
