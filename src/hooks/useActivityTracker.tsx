
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Define the ActivityType enum
export type ActivityType = 
  | "page_view" 
  | "button_click" 
  | "form_submit" 
  | "sign_in" 
  | "sign_out" 
  | "skill_staking_page_viewed" // Add the new activity type
  | "profile_update" 
  | "content_view" 
  | "resource_download" 
  | "search" 
  | "filter_change" 
  | "tab_switch" 
  | "modal_open" 
  | "modal_close";

export function useActivityTracker() {
  const { user } = useAuth();

  const trackActivity = useCallback(
    async (
      type: ActivityType,
      details: Record<string, any> = {}
    ): Promise<void> => {
      if (!user) return;

      try {
        const { error } = await supabase.from("user_activity_logs").insert({
          user_id: user.id,
          activity_type: type,
          metadata: {
            ...details,
            url: window.location.href,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
          },
        });

        if (error) {
          console.error("Error tracking activity:", error);
        }
      } catch (err) {
        console.error("Failed to track user activity:", err);
      }
    },
    [user]
  );

  return { trackActivity };
}
