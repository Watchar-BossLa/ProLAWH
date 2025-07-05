
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Phone } from 'lucide-react';
import { useWebRTC } from '@/hooks/webrtc/useWebRTC';
import { VideoCallInterface } from '@/components/video/VideoCallInterface';
import { IncomingCallDialog } from '@/components/video/IncomingCallDialog';
import { NetworkConnection } from '@/types/network';

interface VideoCallButtonProps {
  connection: NetworkConnection;
  variant?: 'video' | 'audio';
}

export function VideoCallButton({ connection, variant = 'video' }: VideoCallButtonProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const { initiateCall } = useWebRTC();

  const handleStartCall = async () => {
    try {
      await initiateCall(connection.userId);
      setIsInCall(true);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
  };

  const handleAcceptCall = () => {
    setShowIncomingCall(false);
    setIsInCall(true);
  };

  const handleDeclineCall = () => {
    setShowIncomingCall(false);
  };

  if (isInCall) {
    return (
      <VideoCallInterface 
        connection={connection} 
        onEndCall={handleEndCall}
      />
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleStartCall}
        className="flex items-center gap-2"
      >
        {variant === 'video' ? (
          <Video className="h-4 w-4" />
        ) : (
          <Phone className="h-4 w-4" />
        )}
        {variant === 'video' ? 'Video Call' : 'Audio Call'}
      </Button>

      <IncomingCallDialog
        isOpen={showIncomingCall}
        connection={connection}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />
    </>
  );
}
