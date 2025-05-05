
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { VerificationMethod, useSkillVerification } from "@/hooks/useSkillVerification";
import { Upload, Check, X } from "lucide-react";

interface VerificationFormProps {
  selectedMethod: VerificationMethod;
  onCancel: () => void;
}

export function VerificationForm({ selectedMethod, onCancel }: VerificationFormProps) {
  const { uploadVerificationEvidence, isUploading, uploadProgress, verifySkill, isVerifying } = useSkillVerification();
  const [file, setFile] = useState<File | null>(null);
  const [evidence, setEvidence] = useState<string>("");
  const [skillId, setSkillId] = useState<string>("skill-1"); // In a real app, this would be selected by the user

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await verifySkill.mutateAsync({ 
      skillId,
      method: selectedMethod,
      evidence: selectedMethod === "credential" ? file : evidence
    });
    
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium text-lg">
        {selectedMethod === "challenge" && "Complete a Skill Challenge"}
        {selectedMethod === "credential" && "Upload Your Credential"}
        {selectedMethod === "endorsement" && "Request Expert Endorsements"}
      </h3>

      {selectedMethod === "challenge" && (
        <>
          <p className="text-sm text-muted-foreground mb-2">
            Complete a practical challenge to demonstrate your skill
          </p>
          <Button type="submit" disabled={isVerifying}>
            Start Challenge
          </Button>
        </>
      )}

      {selectedMethod === "credential" && (
        <>
          <p className="text-sm text-muted-foreground mb-2">
            Upload a certification document that verifies this skill
          </p>
          <div className="border rounded-md p-4 bg-muted/50">
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2 py-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Select file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG or PNG (max 5MB)
                </span>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>

            {isUploading && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-1" />
                <p className="text-xs text-right mt-1">{uploadProgress}%</p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isUploading || isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || isUploading || isVerifying}
              className="gap-2"
            >
              {isUploading ? (
                "Uploading..."
              ) : isVerifying ? (
                "Verifying..."
              ) : (
                <>
                  <Check className="h-4 w-4" /> Submit Credential
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {selectedMethod === "endorsement" && (
        <>
          <p className="text-sm text-muted-foreground mb-2">
            Request endorsements from industry experts
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="expert-emails" className="block text-sm font-medium mb-1">
                Expert Email Addresses
              </label>
              <Input
                id="expert-emails"
                placeholder="Enter emails separated by commas"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 3 experts required
              </p>
            </div>
            
            <div>
              <label htmlFor="endorsement-message" className="block text-sm font-medium mb-1">
                Endorsement Request Message
              </label>
              <Textarea
                id="endorsement-message"
                placeholder="Write a message requesting endorsement"
                className="w-full h-24"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={evidence.length < 10 || isVerifying}
              className="gap-2"
            >
              {isVerifying ? (
                "Sending..."
              ) : (
                <>
                  <Check className="h-4 w-4" /> Request Endorsements
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
