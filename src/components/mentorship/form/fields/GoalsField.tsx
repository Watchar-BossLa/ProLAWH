
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
import { z } from "zod";
import { formSchema } from "../schema";

interface GoalsFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function GoalsField({ form }: GoalsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="goals"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Goals</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="List specific goals you'd like to achieve (one per line)"
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
