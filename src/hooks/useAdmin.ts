
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/types/admin";

export function useAdmin() {
  const { data: currentAdminUser } = useQuery({
    queryKey: ["admin-user"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_users")
        .select("*")
        .single();

      if (error) return null;
      return data as AdminUser;
    }
  });

  const isAdmin = !!currentAdminUser;
  const hasRole = (role: AdminUser['role']) => currentAdminUser?.role === role;

  return {
    currentAdminUser,
    isAdmin,
    hasRole
  };
}
