import { TeamFormationSimulator } from '../TeamFormationSimulator';
import { GreenProjectsMarketplace } from './GreenProjectsMarketplace';

interface ProjectsTabContentProps {
  selectedProject: {
    title: string;
    description: string;
    requiredSkills: string[];
  };
  projects: any[];
}

export function ProjectsTabContent({ selectedProject, projects }: ProjectsTabContentProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <TeamFormationSimulator selectedProject={selectedProject} />
        </div>
        <div className="md:col-span-2">
          <GreenProjectsMarketplace projects={projects} />
        </div>
      </div>
    </div>
  );
}
