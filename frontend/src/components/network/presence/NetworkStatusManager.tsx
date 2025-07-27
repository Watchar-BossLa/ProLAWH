
import { useEffect } from 'react';
import { usePresenceStatus } from '@/hooks/usePresenceStatus';

interface NetworkStatusManagerProps {
  children: React.ReactNode;
}

export function NetworkStatusManager({ children }: NetworkStatusManagerProps) {
  const { updateStatus } = usePresenceStatus();
  
  useEffect(() => {
    // Update user status to online when component mounts
    updateStatus('online');
    
    // Set status to offline when component unmounts
    return () => {
      updateStatus('offline');
    };
  }, [updateStatus]);

  return <>{children}</>;
}
