
interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  isActive?: boolean;
}

interface ExperienceTimelineProps {
  experiences: ExperienceItem[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="space-y-4">
      {experiences.map((experience, index) => (
        <div 
          key={index} 
          className={`border-l-2 ${experience.isActive ? 'border-primary' : 'border-muted'} pl-4 py-1`}
        >
          <h4 className="font-medium">{experience.role}</h4>
          <p className="text-sm">{experience.company}</p>
          <p className="text-xs text-muted-foreground">{experience.period}</p>
        </div>
      ))}
    </div>
  );
}
