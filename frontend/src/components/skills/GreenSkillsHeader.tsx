
import { Leaf } from 'lucide-react';

export function GreenSkillsHeader() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold">Green Skills</h1>
      </div>
      
      <p className="text-muted-foreground max-w-2xl">
        Explore sustainable skills that contribute to environmental conservation and eco-friendly practices.
        Track their CO2 reduction potential and market growth rates to stay ahead in the green economy.
      </p>
    </>
  );
}
