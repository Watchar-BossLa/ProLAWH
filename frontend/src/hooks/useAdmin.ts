
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/admin";

export function useAdmin() {
  const { data: currentAdminUser, isLoading } = useQuery({
    queryKey: ["admin-user"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return null;
        
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Admin fetch error:", error);
          return null;
        }
        
        return data as AdminUser;
      } catch (error) {
        console.error("Admin authentication error:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isAdmin = !!currentAdminUser;
  const hasRole = (role: AdminUser['role']) => currentAdminUser?.role === role;

  return {
    currentAdminUser,
    isAdmin,
    isLoading,
    hasRole
  };
}
