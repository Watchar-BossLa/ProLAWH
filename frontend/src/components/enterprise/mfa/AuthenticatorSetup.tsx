
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { MFASetup } from '@/components/security/mfa/MFASetup';

interface AuthenticatorSetupProps {
  onSetupComplete?: () => void;
}

export function AuthenticatorSetup({ onSetupComplete }: AuthenticatorSetupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Setup Authenticator App
        </CardTitle>
        <CardDescription>
          Configure a new authenticator app or replace an existing one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MFASetup onComplete={onSetupComplete} />
      </CardContent>
    </Card>
  );
}
