
import React, { useState } from 'react';
import { useStudyBeeMessageHandler } from './sync/StudyBeeMessageHandler';
import { StudyBeeSession, StudyBeeProgress } from '@/integrations/studybee/types';

interface StudyBeeSyncProps {
  onSessionUpdate?: (session: StudyBeeSession) => void;
  onProgressUpdate?: (progress: StudyBeeProgress) => void;
}

export function StudyBeeSync({ onSessionUpdate, onProgressUpdate }: StudyBeeSyncProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useStudyBeeMessageHandler({
    onSessionUpdate,
    onProgressUpdate,
    setLastSyncTime,
    setIsConnected
  });

  // Send study goals to Study Bee
  const syncStudyGoals = async (goals: any[]) => {
    const studyBeeWindow = window.open('', 'studybee');
    if (studyBeeWindow) {
      studyBeeWindow.postMessage({
        type: 'sync_goals',
        data: { goals }
      }, 'https://www.studybee.info');
    }
  };

  return (
    <div className="hidden">
      {/* This component handles background sync - no UI */}
      {isConnected && lastSyncTime && (
        <div className="text-xs text-muted-foreground">
          Last sync: {lastSyncTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
