
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
import { z } from "zod";
import { formSchema } from "../schema";

interface DurationFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function DurationField({ form }: DurationFieldProps) {
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
  );
}
