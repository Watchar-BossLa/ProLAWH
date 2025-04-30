
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { useProjectMarketplace } from "@/hooks/useProjectMarketplace";
import { GreenProject } from "@/types/projects";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const projectFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  skillsNeeded: z.array(z.string()).min(1, { message: "Add at least one required skill" }),
  teamSize: z.number().min(1, { message: "Team size must be at least 1" }),
  duration: z.string().min(1, { message: "Please specify a duration" }),
  impactArea: z.string().min(1, { message: "Please select an impact area" }),
  location: z.string().optional(),
  deadline: z.string().optional(),
  carbonReduction: z.number().min(0, { message: "Carbon reduction must be a positive number" }),
  sdgAlignment: z.array(z.string()).optional(),
  compensation: z.string().optional(),
  hasInsurance: z.boolean().default(false),
  insuranceDetails: z.record(z.string()).optional()
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function CreateProjectForm() {
  const [newSkill, setNewSkill] = useState("");
  const { createProject, isSubmitting } = useProjectMarketplace();
  
  const defaultValues: ProjectFormValues = {
    title: "",
    description: "",
    category: "General",
    skillsNeeded: [],
    teamSize: 3,
    duration: "3 months",
    impactArea: "Community",
    location: "",
    deadline: "",
    carbonReduction: 0,
    sdgAlignment: [],
    compensation: "",
    hasInsurance: false,
    insuranceDetails: {}
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });
  
  const skillsNeeded = form.watch("skillsNeeded");
  const hasInsurance = form.watch("hasInsurance");
  
  const handleAddSkill = () => {
    if (!newSkill || skillsNeeded.includes(newSkill)) {
      toast({
        title: skillsNeeded.includes(newSkill) ? "Skill already added" : "Empty skill",
        description: skillsNeeded.includes(newSkill) 
          ? "This skill is already in the list" 
          : "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("skillsNeeded", [...skillsNeeded, newSkill]);
    setNewSkill("");
  };
  
  const handleRemoveSkill = (skill: string) => {
    form.setValue(
      "skillsNeeded",
      skillsNeeded.filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      await createProject(data as GreenProject);
      form.reset(defaultValues);
      toast({
        title: "Project Created",
        description: "Your project has been created successfully",
      });
    } catch (error) {
      console.error("Project creation failed:", error);
    }
  };

  const categoryOptions = ["Climate Action", "Conservation", "Renewable Energy", "Sustainable Agriculture", "Waste Reduction", "Water Management", "General"];
  const impactAreaOptions = ["Climate", "Conservation", "Community"];
  const sdgOptions = [
    { value: "SDG1", label: "No Poverty" },
    { value: "SDG2", label: "Zero Hunger" },
    { value: "SDG3", label: "Good Health and Well-being" },
    { value: "SDG6", label: "Clean Water and Sanitation" },
    { value: "SDG7", label: "Affordable and Clean Energy" },
    { value: "SDG11", label: "Sustainable Cities and Communities" },
    { value: "SDG12", label: "Responsible Consumption and Production" },
    { value: "SDG13", label: "Climate Action" },
    { value: "SDG14", label: "Life Below Water" },
    { value: "SDG15", label: "Life On Land" },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
        <CardDescription>Create a new green project to collaborate with others</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a title for your project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the project, its goals, and impact"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="impactArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Area</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an impact area" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {impactAreaOptions.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 3 months" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Remote or specific location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Deadline</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="compensation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compensation (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Volunteer, $20/hour, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="carbonReduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated CO₂ Reduction (tons)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hasInsurance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Project Insurance</FormLabel>
                        <FormDescription>
                          Does this project have liability insurance?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div>
              <FormLabel>Skills Needed</FormLabel>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Add a required skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
                <Button type="button" onClick={handleAddSkill} variant="secondary">
                  Add
                </Button>
              </div>
              {form.formState.errors.skillsNeeded && (
                <p className="text-sm font-medium text-destructive mt-1">
                  {form.formState.errors.skillsNeeded.message}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {skillsNeeded.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md flex items-center gap-2 text-sm"
                  >
                    {skill}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
