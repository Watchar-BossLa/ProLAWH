
import { useState, useEffect } from 'react';
import { ensureChatAttachmentsBucketExists } from '../integrations/supabase/storage';

export function useInitSupabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initializeSupabaseResources() {
      try {
        // Initialize chat attachments bucket
        await ensureChatAttachmentsBucketExists();
        
        // Add other initialization steps here if needed
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing Supabase resources:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsInitializing(false);
      }
    }

    initializeSupabaseResources();
  }, []);

  return { isInitialized, isInitializing, error };
}
