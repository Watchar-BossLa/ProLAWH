
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { Badge } from "@/components/ui/badge";
import { X, PlusCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateProjectForm() {
  const { createProject, isSubmitting } = useProjectMarketplace();
  const { toast } = useToast();
  
  const [project, setProject] = useState({
    title: "",
    description: "",
    category: "",
    impactArea: "",
    teamSize: 1,
    duration: "",
    location: "",
    deadline: "",
    carbonReduction: undefined as number | undefined,
    compensation: "",
    hasInsurance: false,
    skillsNeeded: [] as string[],
  });
  
  const [newSkill, setNewSkill] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProject(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProject(prev => ({ ...prev, [name]: checked }));
  };
  
  const addSkill = () => {
    if (newSkill.trim() && !project.skillsNeeded.includes(newSkill.trim())) {
      setProject(prev => ({
        ...prev,
        skillsNeeded: [...prev.skillsNeeded, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };
  
  const removeSkill = (skillToRemove: string) => {
    setProject(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!project.title || !project.description || !project.category || 
        !project.impactArea || !project.teamSize || !project.duration) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    await createProject(project);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a New Green Project</CardTitle>
        <CardDescription>
          Create a new sustainability project and find team members with the right skills
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title*</Label>
            <Input
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              placeholder="Enter project title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              placeholder="Describe your project and its environmental impact"
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select
                value={project.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renewable-energy">Renewable Energy</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                  <SelectItem value="waste-reduction">Waste Reduction</SelectItem>
                  <SelectItem value="sustainable-agriculture">Sustainable Agriculture</SelectItem>
                  <SelectItem value="clean-water">Clean Water</SelectItem>
                  <SelectItem value="education">Environmental Education</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="impactArea">Impact Area*</Label>
              <Select
                value={project.impactArea}
                onValueChange={(value) => handleSelectChange("impactArea", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Climate">Climate</SelectItem>
                  <SelectItem value="Conservation">Conservation</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size*</Label>
              <Input
                id="teamSize"
                name="teamSize"
                type="number"
                value={project.teamSize}
                onChange={handleNumberChange}
                min={1}
                max={20}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration*</Label>
              <Input
                id="duration"
                name="duration"
                value={project.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months, 6 weeks"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={project.location}
                onChange={handleChange}
                placeholder="Project location (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <div className="relative">
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={project.deadline}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carbonReduction">Carbon Reduction (tons)</Label>
              <Input
                id="carbonReduction"
                name="carbonReduction"
                type="number"
                value={project.carbonReduction || ""}
                onChange={handleNumberChange}
                placeholder="Estimated CO₂ reduction"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compensation">Compensation</Label>
              <Input
                id="compensation"
                name="compensation"
                value={project.compensation}
                onChange={handleChange}
                placeholder="e.g., Volunteer, Paid, Equity"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasInsurance" className="cursor-pointer">Project Insurance</Label>
              <Switch
                id="hasInsurance"
                checked={project.hasInsurance}
                onCheckedChange={(checked) => handleSwitchChange("hasInsurance", checked)}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Enable project insurance to provide coverage for team members
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Skills Needed</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add required skills"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {project.skillsNeeded.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.skillsNeeded.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1 pl-2">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
