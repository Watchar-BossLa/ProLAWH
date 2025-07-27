
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff } from 'lucide-react';
import { NetworkConnection } from '@/types/network';

interface IncomingCallDialogProps {
  isOpen: boolean;
  connection: NetworkConnection;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCallDialog({ 
  isOpen, 
  connection, 
  onAccept, 
  onDecline 
}: IncomingCallDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Incoming call from</p>
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarImage src={connection.avatar} />
              <AvatarFallback className="text-2xl">
                {connection.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{connection.name}</h3>
            <p className="text-sm text-muted-foreground">{connection.title}</p>
          </div>

          <div className="flex items-center gap-8">
            {/* Decline */}
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={onDecline}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            {/* Accept */}
            <Button
              variant="default"
              size="lg"
              className="rounded-full w-16 h-16 bg-green-600 hover:bg-green-700"
              onClick={onAccept}
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
