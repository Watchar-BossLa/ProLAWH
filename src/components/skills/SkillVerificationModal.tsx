
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useVeriSkill } from "@/hooks/useVeriSkill";
import { useSkillVerification, type VerificationMethod } from "@/hooks/useSkillVerification";
import { Loader2, Upload, Award, Users } from "lucide-react";
import type { GreenSkill } from "@/hooks/useGreenSkills";

interface SkillVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: GreenSkill;
}

export function SkillVerificationModal({ isOpen, onClose, skill }: SkillVerificationModalProps) {
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("challenge");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const { verifySkill, isVerifying } = useSkillVerification();
  const { walletConnected } = useVeriSkill();

  const handleVerify = async () => {
    if (!skill) return;
    
    try {
      await verifySkill.mutateAsync({
        skillId: skill.id,
        method: verificationMethod,
        evidence: evidence || undefined,
        notes: notes || undefined,
      });
      
      onClose();
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidence(e.target.files[0]);
    }
  };
  
  if (!skill) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Verify Skill: {skill.name}</DialogTitle>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline">{skill.category}</Badge>
            {skill.co2_reduction_potential && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100">
                CO₂ Reduction
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="challenge" onValueChange={(v) => setVerificationMethod(v as VerificationMethod)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="challenge">Challenge</TabsTrigger>
            <TabsTrigger value="credential">Credential</TabsTrigger>
            <TabsTrigger value="endorsement">Endorsement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="challenge" className="space-y-4">
            <div className="text-sm">
              Complete a verification challenge to demonstrate your proficiency in this skill.
            </div>
            {!walletConnected && (
              <div className="border rounded-md p-4 bg-muted/20">
                <h4 className="font-medium mb-2">Wallet Required</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your wallet to receive a blockchain credential after verification.
                </p>
                <ConnectWalletButton />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="credential" className="space-y-4">
            <div className="text-sm mb-4">
              Upload a certificate or credential that verifies your proficiency in this skill.
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credential">Upload Certificate</Label>
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                {evidence ? (
                  <div className="w-full text-center">
                    <p className="font-medium">{evidence.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(evidence.size / 1024).toFixed(1)} KB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2" 
                      onClick={() => setEvidence(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium mb-1">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, JPG, PNG (max 5MB)
                    </p>
                    <Input 
                      id="credential" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <label htmlFor="credential">Select File</label>
                    </Button>
                  </>
                )}
              </div>
              
              <div className="mt-3">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Add any relevant information about your credential..." 
                  className="mt-1"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            {!walletConnected && (
              <div className="border rounded-md p-4 bg-muted/20 mt-4">
                <h4 className="font-medium mb-2">Wallet Required</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your wallet to receive a blockchain credential after verification.
                </p>
                <ConnectWalletButton />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="endorsement" className="space-y-4">
            <div className="text-sm">
              Request an endorsement from peers or mentors who can verify your skill.
            </div>
            
            <div className="space-y-3">
              <Label>Select Endorsers</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from your connections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connection-1">Alex Thompson (Mentor)</SelectItem>
                  <SelectItem value="connection-2">Priya Sharma (Peer)</SelectItem>
                  <SelectItem value="connection-3">Mark Wilson (Expert)</SelectItem>
                </SelectContent>
              </Select>
              
              <Label htmlFor="endorsement-message">Message</Label>
              <Textarea
                id="endorsement-message"
                placeholder="Add a message for your endorsers..."
                className="mt-1"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            {!walletConnected && (
              <div className="border rounded-md p-4 bg-muted/20">
                <h4 className="font-medium mb-2">Wallet Required</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your wallet to receive a blockchain credential after verification.
                </p>
                <ConnectWalletButton />
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleVerify} 
            disabled={isVerifying || !walletConnected}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : verificationMethod === 'challenge' ? (
              <>
                <Award className="mr-2 h-4 w-4" />
                Start Challenge
              </>
            ) : verificationMethod === 'credential' ? (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Credential
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Request Endorsement
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
