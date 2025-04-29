
import { TeamFormationSimulator } from '../TeamFormationSimulator';
import { ProjectMarketplace } from '../../projects/ProjectMarketplace';
import { useProjectsData } from './useProjectsData';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectsTabContentProps {
  selectedProject: {
    title: string;
    description: string;
    requiredSkills: string[];
  };
  projects: any[];
}

export function ProjectsTabContent({ selectedProject, projects }: ProjectsTabContentProps) {
  const { projectCounts } = useProjectsData(projects);
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Collaborative Projects</h2>
        <Button 
          onClick={() => navigate('/dashboard/projects-marketplace')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Explore Projects Marketplace
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <TeamFormationSimulator selectedProject={selectedProject} />
        </div>
        <div className="md:col-span-2">
          <ProjectMarketplace />
        </div>
      </div>
    </div>
  );
}
