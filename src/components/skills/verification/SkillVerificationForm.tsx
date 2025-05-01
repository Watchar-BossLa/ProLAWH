
import { useState } from "react";
import { useSkillVerification } from "@/hooks/useSkillVerification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Award, UserCheck, Upload } from "lucide-react";

interface SkillVerificationFormProps {
  userSkillId: string;
  skillName: string;
}

export function SkillVerificationForm({ userSkillId, skillName }: SkillVerificationFormProps) {
  const {
    submitVerification,
    isSubmittingVerification,
    selectedVerificationType,
    setSelectedVerificationType
  } = useSkillVerification(userSkillId);

  const [source, setSource] = useState("");
  const [evidence, setEvidence] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    await submitVerification({
      type: selectedVerificationType as 'assessment' | 'peer_review' | 'blockchain' | 'certificate',
      source,
      evidence
    });
    
    // Reset form
    setSource("");
    setEvidence("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Skill: {skillName}</CardTitle>
        <CardDescription>
          Choose a verification method to validate your {skillName} skill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs
            value={selectedVerificationType}
            onValueChange={setSelectedVerificationType}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="certificate">Certificate</TabsTrigger>
              <TabsTrigger value="peer_review">Peer Review</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assessment">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <p>Complete an assessment to verify your knowledge</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-source">Assessment Provider</Label>
                  <Input 
                    id="assessment-source" 
                    placeholder="e.g. ProLawh Assessment Platform" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment-evidence">Assessment Result URL or Reference</Label>
                  <Input 
                    id="assessment-evidence" 
                    placeholder="e.g. https://assessment.example.com/results/123" 
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="certificate">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <p>Upload a certificate from a recognized institution</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate-source">Certificate Issuer</Label>
                  <Input 
                    id="certificate-source" 
                    placeholder="e.g. Microsoft, AWS, Google" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificate-evidence">Certificate ID or URL</Label>
                  <Input 
                    id="certificate-evidence" 
                    placeholder="e.g. Certificate ID or verification URL" 
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="peer_review">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserCheck className="h-4 w-4" />
                  <p>Get verification from a recognized expert or mentor</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peer-source">Reviewer Name/Email</Label>
                  <Input 
                    id="peer-source" 
                    placeholder="e.g. John Doe (john@example.com)" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peer-evidence">Review Details</Label>
                  <Textarea 
                    id="peer-evidence" 
                    placeholder="Describe the peer review process and outcomes" 
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="blockchain">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Upload className="h-4 w-4" />
                  <p>Link to a blockchain-based credential</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockchain-source">Blockchain Network</Label>
                  <Input 
                    id="blockchain-source" 
                    placeholder="e.g. Ethereum, Polygon, Solana" 
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockchain-evidence">Transaction Hash or Token ID</Label>
                  <Input 
                    id="blockchain-evidence" 
                    placeholder="e.g. 0x1234..." 
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmittingVerification || !source}
            >
              {isSubmittingVerification ? "Submitting..." : "Submit Verification"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Verified skills earn higher visibility and improve matching for projects.
      </CardFooter>
    </Card>
  );
}
