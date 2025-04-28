
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function ProjectsTabs({ activeTab, onTabChange }: ProjectsTabsProps) {
  return (
    <TabsList className="grid grid-cols-4 w-full md:w-[400px]">
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="climate">Climate</TabsTrigger>
      <TabsTrigger value="conservation">Conservation</TabsTrigger>
      <TabsTrigger value="community">Community</TabsTrigger>
    </TabsList>
  );
}
