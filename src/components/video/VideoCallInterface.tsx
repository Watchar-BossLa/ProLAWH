
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useWebRTC } from '@/hooks/webrtc/useWebRTC';
import { NetworkConnection } from '@/types/network';

interface VideoCallInterfaceProps {
  connection: NetworkConnection;
  onEndCall: () => void;
}

export function VideoCallInterface({ connection, onEndCall }: VideoCallInterfaceProps) {
  const {
    isCallActive,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    endCall
  } = useWebRTC();

  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  const handleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = isSpeakerOn;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-semibold">{connection.name.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-semibold">{connection.name}</h3>
            <Badge variant="outline" className="text-xs">
              {isCallActive ? 'Connected' : 'Connecting...'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <Card className="absolute top-4 right-4 w-48 h-36 overflow-hidden">
          <CardContent className="p-0 h-full">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call Status */}
        {!isCallActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse mb-4">
                <Phone className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-lg">Connecting to {connection.name}...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center gap-4">
          {/* Audio Toggle */}
          <Button
            variant={isAudioEnabled ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleAudio}
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          {/* Video Toggle */}
          <Button
            variant={isVideoEnabled ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleVideo}
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          {/* Screen Share */}
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleScreenShare}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </Button>

          {/* Speaker Toggle */}
          <Button
            variant={isSpeakerOn ? "secondary" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleSpeaker}
          >
            {isSpeakerOn ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>

          {/* End Call */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-16 h-16 ml-4"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
