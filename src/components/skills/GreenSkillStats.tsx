
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function GreenSkillStats() {
  const { data: count } = useQuery({
    queryKey: ['green-skills-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('skills')
        .select('*', { count: 'exact', head: true })
        .eq('is_green_skill', true);
      
      if (error) throw error;
      return count;
    }
  });

  return (
    <div>
      <div className="text-2xl font-bold">{count ?? 0}</div>
      <p className="text-xs text-muted-foreground">
        Skills contributing to sustainability
      </p>
    </div>
  );
}
