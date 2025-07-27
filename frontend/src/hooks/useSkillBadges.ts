
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SkillBadge {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  requirements: Record<string, any>;
  points: number;
}

export function useSkillBadges() {
  return useQuery({
    queryKey: ["skill-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_badges")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      return data as SkillBadge[];
    },
  });
}

export function useUserBadges(userId: string) {
  return useQuery({
    queryKey: ["user-badges", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select(`
          *,
          badge:skill_badges(*)
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
