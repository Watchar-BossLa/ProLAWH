
import { CareerTwinSimulator } from '../AI/CareerTwinSimulator';
import { GreenCareerPathway } from '../GreenCareerPathway';
import { GreenSkillsLearningPath } from '../GreenSkillsLearningPath';

interface CareersTabContentProps {
  userSkills: string[];
  careerOptions: any[];
  learningPaths: any[];
}

export function CareersTabContent({ 
  userSkills, 
  careerOptions, 
  learningPaths 
}: CareersTabContentProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        <CareerTwinSimulator userSkills={userSkills} />
        <GreenCareerPathway careerOptions={careerOptions} />
      </div>
      <div className="mt-6">
        <GreenSkillsLearningPath recommendations={learningPaths} />
      </div>
    </div>
  );
}
