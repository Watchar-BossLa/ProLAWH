
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { VerificationMethodCard } from "./verification/VerificationMethodCard";
import { VerificationForm } from "./verification/VerificationForm";
import type { VerificationMethod } from "@/hooks/useSkillVerification";

interface VerificationMethodInfo {
  id: VerificationMethod;
  name: string;
  description: string;
  requiredEvidence: string;
  icon: JSX.Element;
}

export function SkillVerification() {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod | null>(null);
  const [showForm, setShowForm] = useState(false);

  const verificationMethods: VerificationMethodInfo[] = [
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

  const handleMethodSelect = (methodId: VerificationMethod) => {
    setSelectedMethod(methodId);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleVerify = () => {
    if (!selectedMethod) {
      toast({
        title: "Please select a method",
        description: "You need to select a verification method first",
        variant: "destructive",
      });
      return;
    }
    
    setShowForm(true);
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
        {!showForm ? (
          <>
            <p className="text-sm text-muted-foreground">
              Verified skills increase your credibility and visibility to employers.
              Choose a verification method:
            </p>

            <div className="space-y-3">
              {verificationMethods.map((method) => (
                <VerificationMethodCard
                  key={method.id}
                  id={method.id}
                  name={method.name}
                  description={method.description}
                  requiredEvidence={method.requiredEvidence}
                  icon={method.icon}
                  isSelected={selectedMethod === method.id}
                  onSelect={() => handleMethodSelect(method.id)}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleVerify} disabled={!selectedMethod}>
                Start Verification
              </Button>
            </div>
          </>
        ) : (
          <VerificationForm 
            selectedMethod={selectedMethod!} 
            onCancel={handleCancel} 
          />
        )}
      </CardContent>
    </Card>
  );
}
