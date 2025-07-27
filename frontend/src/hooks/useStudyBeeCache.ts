
import { useState, useEffect, useCallback } from 'react';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface StudyBeeCache {
  sessions: StudyBeeSession[];
  progress: StudyBeeProgress | null;
  lastSyncTime: Date | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'studybee_cache';

export function useStudyBeeCache() {
  const [cache, setCache] = useState<StudyBeeCache>({
    sessions: [],
    progress: null,
    lastSyncTime: null
  });

  const [isStale, setIsStale] = useState(true);

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CacheEntry<StudyBeeCache>;
        if (parsed.expiresAt > Date.now()) {
          setCache(parsed.data);
          setIsStale(false);
        } else {
          localStorage.removeItem(CACHE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load Study Bee cache:', error);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const updateCache = useCallback((updates: Partial<StudyBeeCache>) => {
    const newCache = { ...cache, ...updates, lastSyncTime: new Date() };
    setCache(newCache);
    setIsStale(false);

    // Save to localStorage
    try {
      const cacheEntry: CacheEntry<StudyBeeCache> = {
        data: newCache,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Failed to save Study Bee cache:', error);
    }
  }, [cache]);

  const getCachedSessions = useCallback((maxAge = CACHE_DURATION) => {
    if (isStale || !cache.lastSyncTime) return null;
    
    const age = Date.now() - cache.lastSyncTime.getTime();
    if (age > maxAge) return null;
    
    return cache.sessions;
  }, [cache.sessions, cache.lastSyncTime, isStale]);

  const getCachedProgress = useCallback((maxAge = CACHE_DURATION) => {
    if (isStale || !cache.lastSyncTime) return null;
    
    const age = Date.now() - cache.lastSyncTime.getTime();
    if (age > maxAge) return null;
    
    return cache.progress;
  }, [cache.progress, cache.lastSyncTime, isStale]);

  const invalidateCache = useCallback(() => {
    setIsStale(true);
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const addSession = useCallback((session: StudyBeeSession) => {
    const newSessions = [session, ...cache.sessions.slice(0, 9)]; // Keep only 10 most recent
    updateCache({ sessions: newSessions });
  }, [cache.sessions, updateCache]);

  const updateProgress = useCallback((progress: StudyBeeProgress) => {
    updateCache({ progress });
  }, [updateCache]);

  return {
    cache,
    isStale,
    getCachedSessions,
    getCachedProgress,
    addSession,
    updateProgress,
    updateCache,
    invalidateCache
  };
}
