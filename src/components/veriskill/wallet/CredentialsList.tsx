
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Shield, Calendar, User } from 'lucide-react';
import { useDigitalWallet } from '@/hooks/useDigitalWallet';
import { format } from 'date-fns';

export function CredentialsList() {
  const { walletState } = useDigitalWallet();

  if (!walletState.identity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verifiable Credentials</CardTitle>
          <CardDescription>Your credential wallet is not set up yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Create a digital wallet first to store verifiable credentials
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verifiable Credentials ({walletState.credentials.length})
        </CardTitle>
        <CardDescription>
          Your W3C-compliant digital credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        {walletState.credentials.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-2">No credentials yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Earn and verify skills to receive verifiable credentials
            </p>
            <Button variant="outline">
              Explore Skills
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {walletState.credentials.map((credential) => (
                <div 
                  key={credential.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">
                        {credential.credentialSubject.achievementType || 'Skill Certificate'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {credential.credentialSubject.skillName || 'Professional Skill'}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {credential.type[1] || credential.type[0]}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>Issuer: {credential.issuer.split(':').pop()?.substring(0, 12)}...</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>Issued: {format(new Date(credential.issuanceDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  
                  {credential.expirationDate && (
                    <div className="mt-2">
                      <Badge 
                        variant={new Date(credential.expirationDate) > new Date() ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        Expires: {format(new Date(credential.expirationDate), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-2 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <Shield className="h-3 w-3" />
                      <span>Cryptographically verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
