
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Leaf } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GreenSkillsListProps {
  categoryFilter: string | null;
}

export function GreenSkillsList({ categoryFilter }: GreenSkillsListProps) {
  const { data: greenSkills, isLoading } = useQuery({
    queryKey: ['green-skills-index', categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('green_skill_index')
        .select('*')
        .order('sustainability_score', { ascending: false });
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
    );
  }

  if (!greenSkills?.length) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center">
        <Leaf className="h-10 w-10 text-green-500 mb-2" />
        <h3 className="text-xl font-semibold">No green skills found</h3>
        <p className="text-muted-foreground">
          {categoryFilter 
            ? `No green skills found in the ${categoryFilter} category.` 
            : "No green skills currently available."}
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Avg. Proficiency</TableHead>
              <TableHead className="text-right">Sustainability Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {greenSkills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.user_count || 0}</TableCell>
                <TableCell>
                  {skill.avg_proficiency 
                    ? (skill.avg_proficiency as number).toFixed(1) 
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {skill.sustainability_score}
                    {skill.sustainability_score >= 70 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
