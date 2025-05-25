
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Users, 
  Share, 
  MessageSquare,
  Settings,
  Monitor
} from "lucide-react";

export function VideoCallInterface() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const participants = [
    { id: '1', name: 'Sarah Chen', avatar: 'SC', isVideoOn: true, isAudioOn: true, isSpeaking: false },
    { id: '2', name: 'Mike Johnson', avatar: 'MJ', isVideoOn: true, isAudioOn: true, isSpeaking: true },
    { id: '3', name: 'Alex Kim', avatar: 'AK', isVideoOn: false, isAudioOn: true, isSpeaking: false },
    { id: '4', name: 'Lisa Wang', avatar: 'LW', isVideoOn: true, isAudioOn: false, isSpeaking: false }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Video Conference</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {participants.length + 1} participants
              </Badge>
              <Badge className="bg-red-100 text-red-800">
                Live
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Video Area */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-96">
            {/* Main Speaker */}
            <div className="lg:col-span-2 bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                    MJ
                  </div>
                  <p className="text-lg font-medium">Mike Johnson</p>
                  <Badge className="mt-2 bg-green-500">Speaking</Badge>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Mike Johnson</span>
              </div>
            </div>

            {/* Participants Grid */}
            <div className="space-y-2">
              {participants.slice(0, 4).map((participant) => (
                <div key={participant.id} className="bg-gray-800 rounded-lg aspect-video relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {participant.isVideoOn ? (
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        {participant.avatar}
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <VideoOff className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs">{participant.name}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-1 left-1 flex items-center gap-1">
                    {!participant.isAudioOn && (
                      <MicOff className="h-3 w-3 text-red-400" />
                    )}
                    {participant.isSpeaking && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 text-white text-xs">
                    {participant.name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-900 rounded-lg">
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <Monitor className="h-5 w-5" />
            </Button>

            <Button variant="secondary" size="lg">
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant={showChat ? "default" : "secondary"}
              size="lg"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button variant="destructive" size="lg">
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Session Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Duration: 23:45</span>
              <span>Quality: HD</span>
              {isScreenSharing && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Share className="h-3 w-3 mr-1" />
                  Screen Sharing
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm">
              Invite Others
            </Button>
          </div>

          {/* Chat Sidebar (when visible) */}
          {showChat && (
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Meeting Chat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Sarah Chen:</span> Great explanation on hooks!
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Alex Kim:</span> Can you share that diagram?
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Lisa Wang:</span> 👍 This is really helpful
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
