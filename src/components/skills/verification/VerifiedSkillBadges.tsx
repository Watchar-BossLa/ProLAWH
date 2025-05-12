
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ExternalLink } from "lucide-react";
import { useBlockchainCredentials } from "@/hooks/useBlockchainCredentials";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function VerifiedSkillBadges() {
  const { user } = useAuth();
  const { credentials, isLoading } = useBlockchainCredentials();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Verified Skills
          </CardTitle>
          <CardDescription>Your blockchain-verified green credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Verified Skills
        </CardTitle>
        <CardDescription>Your blockchain-verified green credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          {credentials && credentials.length > 0 ? (
            <div className="space-y-3">
              {credentials.map((credential) => (
                <div 
                  key={credential.id}
                  className="flex items-start gap-3 p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="bg-primary/20 p-2 rounded-md">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {/* @ts-ignore - skills might be a join relationship */}
                          {credential.skills?.name || "Green Skill"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Verified {new Date(credential.issued_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {credential.transaction_id && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          asChild
                        >
                          <a 
                            href={`https://polygonscan.com/tx/${credential.transaction_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on blockchain"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <div className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full">
                        {credential.credential_type}
                      </div>
                      {credential.metadata && typeof credential.metadata === 'object' && 'verification_method' in credential.metadata && (
                        <div className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                          {String(credential.metadata.verification_method)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Shield className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium">No verified skills yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
                Get your green skills verified to enhance your profile credibility
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
