
import { toast as sonnerToast } from "sonner";

// Minimal shadcn-compatible hook facade for toast usage across the app
export function useToast() {
  return { toast: sonnerToast };
}

// Named export to match existing re-export in src/components/ui/use-toast.ts
export const toast = sonnerToast;
