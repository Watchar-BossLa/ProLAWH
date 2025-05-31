
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface StudyBeeMessage {
  type: 'session_update' | 'progress_sync' | 'achievement' | 'error';
  data: any;
}

export function StudyBeeMessaging() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!user) return;

    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'https://www.studybee.info') return;

      try {
        const message: StudyBeeMessage = event.data;
        
        switch (message.type) {
          case 'session_update':
            handleSessionUpdate(message.data);
            break;
          case 'progress_sync':
            handleProgressSync(message.data);
            break;
          case 'achievement':
            handleAchievement(message.data);
            break;
          case 'error':
            handleError(message.data);
            break;
        }
      } catch (error) {
        console.error('Error processing Study Bee message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    setIsListening(true);

    return () => {
      window.removeEventListener('message', handleMessage);
      setIsListening(false);
    };
  }, [user]);

  const handleSessionUpdate = async (sessionData: any) => {
    // Update local session data
    console.log('Study Bee session update:', sessionData);
    
    // Sync with local database
    // This would typically involve calling your Supabase functions
  };

  const handleProgressSync = async (progressData: any) => {
    console.log('Study Bee progress sync:', progressData);
    
    // Update progress in local database
    // Trigger UI updates
  };

  const handleAchievement = (achievementData: any) => {
    console.log('Study Bee achievement:', achievementData);
    
    // Show notification or update UI
    // Could integrate with ProLawh's achievement system
  };

  const handleError = (errorData: any) => {
    console.error('Study Bee error:', errorData);
    
    // Handle errors gracefully
    // Show user-friendly error messages
  };

  // Send message to Study Bee
  const sendToStudyBee = (message: StudyBeeMessage) => {
    const studyBeeFrame = document.querySelector('iframe[src*="studybee.info"]') as HTMLIFrameElement;
    if (studyBeeFrame && studyBeeFrame.contentWindow) {
      studyBeeFrame.contentWindow.postMessage(message, 'https://www.studybee.info');
    }
  };

  return null; // This is a utility component, no UI
}
