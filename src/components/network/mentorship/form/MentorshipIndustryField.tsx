
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
import { INDUSTRIES } from "@/constants/mentorship";

interface MentorshipIndustryFieldProps {
  form: UseFormReturn<MentorshipFormData>;
}

export function MentorshipIndustryField({ form }: MentorshipIndustryFieldProps) {
  return (
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
              {INDUSTRIES.map((industry) => (
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
  );
}
