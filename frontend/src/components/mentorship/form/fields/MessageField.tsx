
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schema";

interface MessageFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function MessageField({ form }: MessageFieldProps) {
  return (
    <FormField
      control={form.control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Message</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Explain why you want to be mentored and what you hope to achieve"
              {...field}
              rows={4}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
