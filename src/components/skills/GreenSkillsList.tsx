
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
import { TrendingUp, TrendingDown } from "lucide-react";

export function GreenSkillsList() {
  const { data: greenSkills, isLoading } = useQuery({
    queryKey: ['green-skills-index'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('green_skill_index')
        .select('*')
        .order('sustainability_score', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
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
            {greenSkills?.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell>{skill.category}</TableCell>
                <TableCell>{skill.user_count}</TableCell>
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
