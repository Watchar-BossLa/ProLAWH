
import { useEffect, useCallback } from 'react';
import { useStudyBeeCache } from './useStudyBeeCache';
import { useStudyBeeConnection } from './studybee/useStudyBeeConnection';
import { useStudyBeeData } from './studybee/useStudyBeeData';
import { useStudyBeeRealtime } from './studybee/useStudyBeeRealtime';
import { useStudyBeeErrorHandler } from './useStudyBeeErrorHandler';

export function useStudyBeeIntegration() {
  const { retry } = useStudyBeeErrorHandler();
  const { cache, getCachedSessions, getCachedProgress } = useStudyBeeCache();
  
  const { isConnected, loading: connectionLoading, connectToStudyBee } = useStudyBeeConnection();
  
  const {
    sessions,
    progress,
    loading: dataLoading,
    error,
    lastSyncTime,
    fetchStudyBeeData,
    studyStats,
    invalidateCache,
    setSessions,
    setProgress,
    setLastSyncTime
  } = useStudyBeeData();

  // Load cached data first for better UX
  useEffect(() => {
    const cachedSessions = getCachedSessions();
    const cachedProgress = getCachedProgress();
    
    if (cachedSessions) setSessions(cachedSessions);
    if (cachedProgress) setProgress(cachedProgress);
    if (cache.lastSyncTime) setLastSyncTime(cache.lastSyncTime);
  }, [getCachedSessions, getCachedProgress, cache.lastSyncTime, setSessions, setProgress, setLastSyncTime]);

  // Set up real-time subscriptions
  useStudyBeeRealtime({
    onSessionUpdate: (session) => {
      setSessions(prev => [session, ...prev.slice(0, 9)]);
      setLastSyncTime(new Date());
    },
    onProgressUpdate: (updatedProgress) => {
      setProgress(updatedProgress);
      setLastSyncTime(new Date());
    }
  });

  const syncData = useCallback(async () => {
    if (!isConnected) return;
    
    await retry(fetchStudyBeeData);
  }, [isConnected, retry, fetchStudyBeeData]);

  const handleConnect = async () => {
    const success = await connectToStudyBee();
    if (success) {
      invalidateCache(); // Clear cache to force fresh data
      await fetchStudyBeeData();
    }
    return success;
  };

  return {
    isConnected,
    sessions,
    progress,
    loading: connectionLoading || dataLoading,
    error,
    lastSyncTime,
    connectToStudyBee: handleConnect,
    refreshData: fetchStudyBeeData,
    syncData,
    studyStats
  };
}
