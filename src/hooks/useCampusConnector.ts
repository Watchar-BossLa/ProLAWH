
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CampusConnection, CampusStats } from '@/types/campus';

export function useCampusConnector() {
  const [connections, setConnections] = useState<CampusConnection[] | null>(null);
  const [stats, setStats] = useState<CampusStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampusConnector = async () => {
      try {
        setIsLoading(true);
        
        // For now, we'll use mock data until we implement the actual database tables
        // This would be replaced with an actual Supabase query in production
        
        // Mock stats
        const mockStats: CampusStats = {
          universities: 8,
          students: 12540,
          courses: 247,
          badges: 3829
        };
        
        // Mock connections
        const mockConnections: CampusConnection[] = [
          {
            id: '1',
            name: 'Stanford University',
            domain: 'stanford.edu',
            lmsType: 'Canvas',
            status: 'active',
            studentCount: 4230,
            courseCount: 86,
            badgeCount: 1245,
            lastSync: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          },
          {
            id: '2',
            name: 'MIT',
            domain: 'mit.edu',
            lmsType: 'Moodle',
            status: 'active',
            studentCount: 3850,
            courseCount: 72,
            badgeCount: 1157,
            lastSync: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
          },
          {
            id: '3',
            name: 'UC Berkeley',
            domain: 'berkeley.edu',
            lmsType: 'Canvas',
            status: 'active',
            studentCount: 2780,
            courseCount: 54,
            badgeCount: 832,
            lastSync: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: '4',
            name: 'Harvard University',
            domain: 'harvard.edu',
            lmsType: 'Canvas',
            status: 'pending',
            studentCount: 1680,
            courseCount: 35,
            badgeCount: 595,
            lastSync: new Date(Date.now() - 3600000 * 6).toISOString() // 6 hours ago
          },
        ];
        
        setStats(mockStats);
        setConnections(mockConnections);
        setError(null);
      } catch (err) {
        console.error('Error fetching campus connector data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampusConnector();
  }, []);

  const addConnection = async (connectionData: Partial<CampusConnection>) => {
    try {
      // This would be an actual Supabase insert in production
      // For now, we'll just update our local state with the new connection
      
      const newConnection: CampusConnection = {
        id: Date.now().toString(),
        name: connectionData.name || 'Unnamed University',
        domain: connectionData.domain || 'example.edu',
        lmsType: connectionData.lmsType || 'Canvas',
        status: 'pending',
        studentCount: 0,
        courseCount: 0,
        badgeCount: 0,
        lastSync: new Date().toISOString()
      };
      
      setConnections(prev => prev ? [...prev, newConnection] : [newConnection]);
      
      // Update stats
      setStats(prev => prev ? {
        ...prev,
        universities: prev.universities + 1
      } : null);
      
      return { success: true, connection: newConnection };
    } catch (err) {
      console.error('Error adding campus connection:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Unknown error occurred') };
    }
  };

  const removeConnection = async (connectionId: string) => {
    try {
      // This would be an actual Supabase delete in production
      // For now, we'll just update our local state
      
      const connectionToRemove = connections?.find(c => c.id === connectionId);
      setConnections(prev => prev ? prev.filter(c => c.id !== connectionId) : null);
      
      // Update stats if we found the connection
      if (connectionToRemove) {
        setStats(prev => prev ? {
          ...prev,
          universities: Math.max(0, prev.universities - 1),
          students: Math.max(0, prev.students - connectionToRemove.studentCount),
          badges: Math.max(0, prev.badges - connectionToRemove.badgeCount)
        } : null);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error removing campus connection:', err);
      return { success: false, error: err instanceof Error ? err : new Error('Unknown error occurred') };
    }
  };

  return {
    connections,
    stats,
    isLoading,
    error,
    addConnection,
    removeConnection
  };
}
