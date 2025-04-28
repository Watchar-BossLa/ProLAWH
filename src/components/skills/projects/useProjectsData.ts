
import { useMemo } from 'react';
import { GreenProject } from '@/types/projects';

export function useProjectsData(projects: GreenProject[]) {
  const projectCounts = useMemo(() => {
    return {
      all: projects.length,
      climate: projects.filter(p => p.impactArea === "Climate").length,
      conservation: projects.filter(p => p.impactArea === "Conservation").length,
      community: projects.filter(p => p.impactArea === "Community").length,
      insured: projects.filter(p => p.hasInsurance).length,
    };
  }, [projects]);

  return { projectCounts };
}
