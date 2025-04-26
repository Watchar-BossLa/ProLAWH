
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type LearningPath = Database["public"]["Tables"]["learning_paths"]["Row"];

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {path.cover_image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={path.cover_image}
            alt={path.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{path.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {path.description || "No description available"}
        </p>
        {path.estimated_duration && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">
              {path.estimated_duration}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
