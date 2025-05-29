
import { supabase } from '@/integrations/supabase/client';

export function useAuthActions() {
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error during sign out:", err);
      throw err instanceof Error ? err : new Error('Error during sign out');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error during sign in:", err);
      throw err instanceof Error ? err : new Error('Error during sign in');
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error during sign up:", err);
      throw err instanceof Error ? err : new Error('Error during sign up');
    }
  };

  return {
    signOut,
    signIn,
    signUp
  };
}
