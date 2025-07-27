
export function GreenSkillsError({ message }: { message: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <p className="text-destructive">Error fetching green skills: {message}</p>
    </div>
  );
}
