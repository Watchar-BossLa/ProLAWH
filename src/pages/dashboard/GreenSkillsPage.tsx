import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GreenSkillsList } from '@/components/skills/GreenSkillsList';
import { GreenSkillStats } from '@/components/skills/GreenSkillStats';

const fetchGreenSkills = async () => {
  const { data, error } = await supabase
    .from('green_skills')
    .select('*');

  if (error) throw error;
  return data;
};

export default function GreenSkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { 
    data: greenSkills, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['green-skills'],
    queryFn: fetchGreenSkills
  });

  if (isLoading) return <div>Loading green skills...</div>;
  if (error) return <div>Error fetching green skills: {error.message}</div>;

  const categories = [...new Set(greenSkills?.map(skill => skill.category) || [])];

  const filteredSkills = selectedCategory
    ? greenSkills?.filter(skill => skill.category === selectedCategory)
    : greenSkills;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-500" />
        Green Skills
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? "bg-secondary text-secondary-foreground" : ""}
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant="outline"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-secondary text-secondary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {greenSkills && (
        <>
          <GreenSkillStats greenSkills={greenSkills} />
          <GreenSkillsList greenSkills={filteredSkills || []} />
        </>
      )}
    </div>
  );
}
