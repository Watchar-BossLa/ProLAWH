
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { MFASetup } from './MFASetup';

export function MFAStatus() {
  const { user } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [factors, setFactors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkMFAStatus = async () => {
    if (!user) return;

    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) throw error;
        return data;
      },
      { operation: 'check_mfa_status' }
    );

    if (data) {
      setFactors(data.totp || []);
      setMfaEnabled((data.totp || []).some((factor: any) => factor.status === 'verified'));
    }
    setIsLoading(false);
  };

  const disableMFA = async (factorId: string) => {
    const { error } = await handleAsyncError(
      async () => {
        const { error } = await supabase.auth.mfa.unenroll({
          factorId
        });
        if (error) throw error;
      },
      { operation: 'disable_mfa', factor_id: factorId }
    );

    if (!error) {
      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication has been disabled"
      });
      checkMFAStatus();
    }
  };

  useEffect(() => {
    checkMFAStatus();
  }, [user]);

  if (isLoading) return <div>Loading MFA status...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
          {mfaEnabled && <Badge variant="secondary">Enabled</Badge>}
        </CardTitle>
        <CardDescription>
          Manage your two-factor authentication settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mfaEnabled ? (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your account is protected with two-factor authentication.
              </AlertDescription>
            </Alert>
            
            {factors.map((factor) => (
              <div key={factor.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    {factor.friendly_name}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => disableMFA(factor.id)}
                >
                  Disable
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account.
            </p>
            <MFASetup onComplete={checkMFAStatus} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
