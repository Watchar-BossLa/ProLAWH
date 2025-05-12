
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ChevronRight, Shield } from "lucide-react";
import { SkillVerificationModal } from "./SkillVerificationModal";
import { useGreenSkills } from "@/hooks/useGreenSkills";

interface SkillVerificationProps {
  className?: string;
}

export function SkillVerification({ className }: SkillVerificationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<undefined | any>(undefined);
  const { data: skills = [] } = useGreenSkills();
  
  const handleVerifySkill = (skill: any) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Skill Verification</span>
          </CardTitle>
          <CardDescription>
            Verify your skills with blockchain credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            Verify your skills to receive a blockchain credential that proves your expertise.
            Choose a skill to verify and select a verification method.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => skills.length > 0 && handleVerifySkill(skills[0])}>
            <Award className="mr-2 h-4 w-4" />
            Verify Skills
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      <SkillVerificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        skill={selectedSkill}
      />
    </>
  );
}
