
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
import { z } from "zod";
import { formSchema } from "../schema";

interface FocusAreasFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function FocusAreasField({ form }: FocusAreasFieldProps) {
  return (
    <FormField
      control={form.control}
      name="focusAreas"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Focus Areas</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g. Career Development, Leadership, Technical Skills"
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
