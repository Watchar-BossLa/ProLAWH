
import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

interface CallData {
  callId: string;
  callerId: string;
  recipientId: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidate?: RTCIceCandidate;
  status: 'calling' | 'ringing' | 'connected' | 'ended';
}

export function useWebRTC() {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const rtcConfig: WebRTCConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  const initializePeerConnection = useCallback(() => {
    if (peerConnection.current) return;

    peerConnection.current = new RTCPeerConnection(rtcConfig);

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate && user) {
        // Send ICE candidate through Supabase realtime
        const channel = supabase.channel('webrtc-signaling');
        await channel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            candidate: event.candidate,
            senderId: user.id
          }
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      const state = peerConnection.current?.connectionState;
      if (state === 'connected') {
        setIsCallActive(true);
      } else if (state === 'disconnected' || state === 'failed') {
        endCall();
      }
    };
  }, [user?.id]);

  const startLocalStream = useCallback(async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      if (peerConnection.current && localStream) {
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnection.current.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        videoTrack.onended = () => {
          stopScreenShare();
        };
        
        setIsScreenSharing(true);
      }
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  }, [localStream]);

  const stopScreenShare = useCallback(async () => {
    if (localStream && peerConnection.current) {
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnection.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
      
      setIsScreenSharing(false);
    }
  }, [localStream]);

  const initiateCall = useCallback(async (recipientId: string) => {
    if (!user) return;

    initializePeerConnection();
    const stream = await startLocalStream();
    
    if (peerConnection.current && stream) {
      stream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, stream);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      // Send offer through Supabase call_signals table
      const { error } = await supabase
        .from('call_signals')
        .insert({
          caller_id: user.id,
          recipient_id: recipientId,
          signal_type: 'offer',
          signal_data: offer,
          status: 'calling'
        });

      if (error) {
        console.error('Error sending offer:', error);
      }
    }
  }, [user, initializePeerConnection, startLocalStream]);

  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit, callerId: string) => {
    if (!user) return;

    initializePeerConnection();
    const stream = await startLocalStream();
    
    if (peerConnection.current && stream) {
      stream.getTracks().forEach(track => {
        peerConnection.current!.addTrack(track, stream);
      });

      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      // Send answer through Supabase call_signals table
      const { error } = await supabase
        .from('call_signals')
        .insert({
          caller_id: callerId,
          recipient_id: user.id,
          signal_type: 'answer',
          signal_data: answer,
          status: 'connected'
        });

      if (error) {
        console.error('Error sending answer:', error);
      }
    }
  }, [user, initializePeerConnection, startLocalStream]);

  const endCall = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    setRemoteStream(null);
    setIsCallActive(false);
    setIsScreenSharing(false);
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    isCallActive,
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    localVideoRef,
    remoteVideoRef,
    initiateCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare
  };
}
