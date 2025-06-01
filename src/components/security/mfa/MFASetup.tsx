
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { handleAsyncError } from '@/utils/errorHandling';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { QrCode, Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';

interface MFASetupProps {
  onComplete?: () => void;
}

export function MFASetup({ onComplete }: MFASetupProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'choice' | 'totp_setup' | 'totp_verify' | 'backup_codes'>('choice');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Start TOTP setup
  const setupTOTP = async () => {
    if (!user) return;

    setIsLoading(true);
    const { data, error } = await handleAsyncError(
      async () => {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          friendlyName: user.email || 'TOTP'
        });

        if (error) throw error;
        return data;
      },
      { operation: 'setup_totp' }
    );

    if (data) {
      setQrCodeUrl(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setStep('totp_setup');
    }
    setIsLoading(false);
  };

  // Verify TOTP setup
  const verifyTOTP = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter the 6-digit code from your authenticator app",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const { data, error } = await handleAsyncError(
      async () => {
        // Get the challenge first
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: factorId
        });

        if (challengeError) throw challengeError;

        // Verify the code
        const { data, error } = await supabase.auth.mfa.verify({
          factorId: factorId,
          challengeId: challengeData.id,
          code: verificationCode
        });

        if (error) throw error;
        return data;
      },
      { operation: 'verify_totp' }
    );

    if (data) {
      // Generate backup codes
      await generateBackupCodes();
      setStep('backup_codes');
      
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been successfully enabled"
      });
    }
    setIsLoading(false);
  };

  // Generate backup codes
  const generateBackupCodes = async () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setBackupCodes(codes);

    // Store backup codes in database if table exists
    if (user) {
      const { error } = await handleAsyncError(
        async () => {
          try {
            const { error } = await supabase
              .from('user_mfa_backup_codes' as any)
              .insert(
                codes.map(code => ({
                  user_id: user.id,
                  code,
                  used: false
                })) as any
              );

            if (error) throw error;
          } catch (tableError) {
            console.warn('MFA backup codes table not available yet');
            // Don't throw error, just log warning
          }
        },
        { operation: 'store_backup_codes' }
      );
    }
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    const content = `ProLawh Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\nUser: ${user?.email}\n\n${backupCodes.join('\n')}\n\nImportant:\n- Store these codes in a safe place\n- Each code can only be used once\n- Use these codes if you lose access to your authenticator app`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prolawh-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const complete = () => {
    onComplete?.();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Enable Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'choice' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose your preferred two-factor authentication method:
            </p>
            
            <Button
              onClick={setupTOTP}
              disabled={isLoading}
              className="w-full justify-start"
              variant="outline"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Authenticator App (Recommended)
            </Button>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                We recommend using an authenticator app like Google Authenticator, Authy, or 1Password for the most secure experience.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'totp_setup' && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Scan this QR code with your authenticator app:</p>
              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="border rounded" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mb-2">
                Or enter this code manually:
              </p>
              <code className="text-xs bg-muted p-2 rounded block break-all">
                {secret}
              </code>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Enter 6-digit code from your app:</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
              />
            </div>
            
            <Button
              onClick={verifyTOTP}
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify & Enable'}
            </Button>
          </div>
        )}

        {step === 'backup_codes' && (
          <div className="space-y-4">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              {backupCodes.map((code, index) => (
                <Badge key={index} variant="secondary" className="justify-center p-2">
                  {code}
                </Badge>
              ))}
            </div>
            
            <div className="space-y-2">
              <Button onClick={downloadBackupCodes} variant="outline" className="w-full">
                Download Codes
              </Button>
              <Button onClick={complete} className="w-full">
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
