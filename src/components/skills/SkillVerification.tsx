
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VerificationMethod {
  id: string;
  name: string;
  description: string;
  requiredEvidence: string;
  icon: JSX.Element;
}

export function SkillVerification() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const verificationMethods: VerificationMethod[] = [
    {
      id: "challenge",
      name: "Complete Challenge",
      description: "Demonstrate your skill through a practical challenge",
      requiredEvidence: "Successfully complete the associated skill challenge",
      icon: <Shield className="h-5 w-5 text-blue-500" />,
    },
    {
      id: "credential",
      name: "Upload Credential",
      description: "Upload an existing certification",
      requiredEvidence: "Valid digital credential or certificate",
      icon: <Upload className="h-5 w-5 text-purple-500" />,
    },
    {
      id: "endorsement",
      name: "Expert Endorsement",
      description: "Get endorsed by industry experts",
      requiredEvidence: "Endorsement from 3+ verified experts",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleVerify = () => {
    setUploading(true);
    // Simulate verification process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Verification initiated",
        description: "We'll process your verification request and notify you soon",
      });
      setSelectedMethod(null);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Verify Your Green Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Verified skills increase your credibility and visibility to employers.
          Choose a verification method:
        </p>

        <div className="space-y-3">
          {verificationMethods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{method.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{method.name}</h4>
                    {selectedMethod === method.id && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {method.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleVerify}
            disabled={!selectedMethod || uploading}
          >
            {uploading ? "Processing..." : "Start Verification"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
