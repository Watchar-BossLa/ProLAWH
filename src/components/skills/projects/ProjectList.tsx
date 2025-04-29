
import { ScrollArea } from "@/components/ui/scroll-area";
import { GreenProject } from "@/types/projects";
import { ProjectCard } from "./ProjectCard";
import { NoProjectsFound } from "./NoProjectsFound";

interface ProjectListProps {
  projects: GreenProject[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <NoProjectsFound />
        )}
      </div>
    </ScrollArea>
  );
}
