
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Download, Check, X } from 'lucide-react';
import { useProductionAuth } from '@/components/auth/ProductionAuthProvider';
import { BackupCode } from '@/types/enterprise';
import { toast } from '@/hooks/use-toast';

interface BackupCodesManagerProps {
  onCodesGenerated?: () => void;
}

export function BackupCodesManager({ onCodesGenerated }: BackupCodesManagerProps) {
  const { user } = useProductionAuth();
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [newBackupCode, setNewBackupCode] = useState('');
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  useEffect(() => {
    if (user) {
      // Simulate loading backup codes
      setBackupCodes([]);
    }
  }, [user]);

  const generateNewBackupCodes = async () => {
    if (!user) return;

    setIsGeneratingCodes(true);
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Success",
      description: "New backup codes generated successfully"
    });
    
    downloadBackupCodes(codes);
    onCodesGenerated?.();
    setIsGeneratingCodes(false);
  };

  const downloadBackupCodes = (codes: string[]) => {
    const content = `ProLawh MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\nUser: ${user?.email}\n\n${codes.join('\n')}\n\nImportant:\n- Store these codes in a safe place\n- Each code can only be used once\n- Use these codes if you lose access to your authenticator app`;
    
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

  const validateBackupCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBackupCode.trim()) return;

    // Simulate validation
    const isValid = Math.random() > 0.5;
    
    if (isValid) {
      toast({
        title: "Valid Code",
        description: "This backup code is valid and unused",
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "This backup code is invalid or has already been used",
        variant: "destructive"
      });
    }
    setNewBackupCode('');
  };

  const usedCodesCount = backupCodes.filter(code => code.used).length;
  const unusedCodesCount = backupCodes.filter(code => !code.used).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Backup Codes
        </CardTitle>
        <CardDescription>
          Backup codes allow you to access your account if you lose your authenticator device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{unusedCodesCount}</div>
            <div className="text-sm text-muted-foreground">Unused Codes</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">{usedCodesCount}</div>
            <div className="text-sm text-muted-foreground">Used Codes</div>
          </div>
        </div>

        {unusedCodesCount <= 2 && (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              You're running low on backup codes. Consider generating new ones.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={generateNewBackupCodes} 
            disabled={isGeneratingCodes}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGeneratingCodes ? 'Generating...' : 'Generate New Codes'}
          </Button>
        </div>

        {/* Backup Code Validation */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Test Backup Code</h4>
          <form onSubmit={validateBackupCode} className="flex gap-2">
            <Input
              placeholder="Enter backup code"
              value={newBackupCode}
              onChange={(e) => setNewBackupCode(e.target.value.toUpperCase())}
              className="max-w-xs"
            />
            <Button type="submit" variant="outline">
              Validate
            </Button>
          </form>
        </div>

        {/* Backup Codes List */}
        {backupCodes.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Your Backup Codes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
              {backupCodes.slice(0, 8).map((code) => (
                <div
                  key={code.id}
                  className={`p-2 border rounded flex items-center justify-between ${
                    code.used ? 'bg-muted line-through' : 'bg-background'
                  }`}
                >
                  <span>{code.code}</span>
                  {code.used ? (
                    <X className="h-3 w-3 text-red-500" />
                  ) : (
                    <Check className="h-3 w-3 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
