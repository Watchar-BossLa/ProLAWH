
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wallet, Key, Shield, Download, Copy } from 'lucide-react';
import { useDigitalWallet } from '@/hooks/useDigitalWallet';
import { toast } from '@/hooks/use-toast';

export function WalletSetup() {
  const { walletState, createIdentity, isLoading } = useDigitalWallet();
  const [showRecoveryShares, setShowRecoveryShares] = useState<string[]>([]);

  const handleCreateWallet = async () => {
    try {
      const result = await createIdentity.mutateAsync();
      setShowRecoveryShares(result.recoveryShares.map(share => share.share));
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Recovery share copied successfully",
    });
  };

  const downloadRecoveryShares = () => {
    const sharesData = {
      shares: showRecoveryShares,
      threshold: 2,
      total: 3,
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(sharesData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet-recovery-shares.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (walletState.identity && !showRecoveryShares.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-500" />
            Wallet Active
          </CardTitle>
          <CardDescription>Your digital identity is ready</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Digital Identity (DID)</label>
              <div className="mt-1 p-2 bg-muted rounded text-sm font-mono">
                {walletState.identity.did}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credentials Stored</p>
                <p className="text-sm text-muted-foreground">{walletState.credentials.length} verifiable credentials</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Secured
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showRecoveryShares.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-500" />
            Save Your Recovery Shares
          </CardTitle>
          <CardDescription>
            Store these shares securely. You need 2 of 3 to recover your wallet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                ⚠️ Critical: Save these recovery shares in separate secure locations
              </p>
            </div>
            
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {showRecoveryShares.map((share, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-xs font-medium w-8">#{index + 1}</span>
                    <code className="flex-1 text-xs">{share.substring(0, 40)}...</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(share)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator />
            
            <div className="flex gap-2">
              <Button onClick={downloadRecoveryShares} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Shares
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowRecoveryShares([])}
                className="flex-1"
              >
                I've Saved Them
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Create Digital Wallet
        </CardTitle>
        <CardDescription>
          Set up your decentralized identity and credential wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Generate Keys</h3>
              <p className="text-xs text-muted-foreground">Ed25519 cryptographic keys</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium">Create DID</h3>
              <p className="text-xs text-muted-foreground">Decentralized identifier</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Setup Recovery</h3>
              <p className="text-xs text-muted-foreground">Shamir secret sharing</p>
            </div>
          </div>
          
          <Separator />
          
          <Button 
            onClick={handleCreateWallet} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Creating Wallet..." : "Create Secure Wallet"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Your private keys are stored locally and encrypted. VeriSkill never has access to your private keys.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
