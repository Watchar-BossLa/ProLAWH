
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { XCircle } from "lucide-react";

interface PlanCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTitle: string;
  onCreatePlan: (data: { title: string; description: string; steps: string[] }) => void;
}

export function PlanCreationDialog({ 
  open, 
  onOpenChange, 
  defaultTitle,
  onCreatePlan 
}: PlanCreationDialogProps) {
  const [planTitle, setPlanTitle] = useState(defaultTitle);
  const [planDescription, setPlanDescription] = useState("");
  const [planSteps, setPlanSteps] = useState<string[]>(["", "", ""]);
  
  const addPlanStep = () => {
    setPlanSteps([...planSteps, ""]);
  };
  
  const updatePlanStep = (index: number, value: string) => {
    const newSteps = [...planSteps];
    newSteps[index] = value;
    setPlanSteps(newSteps);
  };

  const removePlanStep = (index: number) => {
    setPlanSteps(planSteps.filter((_, i) => i !== index));
  };
  
  const handleCreatePlan = () => {
    const filteredSteps = planSteps.filter(step => step.trim().length > 0);
    onCreatePlan({
      title: planTitle,
      description: planDescription,
      steps: filteredSteps,
    });
    onOpenChange(false);
    
    // Reset form after submission
    setPlanTitle(defaultTitle);
    setPlanDescription("");
    setPlanSteps(["", "", ""]);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Implementation Plan</DialogTitle>
          <DialogDescription>
            Create a step-by-step plan to implement this career recommendation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input 
              id="title" 
              value={planTitle} 
              onChange={(e) => setPlanTitle(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={planDescription} 
              onChange={(e) => setPlanDescription(e.target.value)} 
              placeholder="Describe your implementation plan..."
              className="h-20"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Steps to Take</Label>
            {planSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={step}
                  onChange={(e) => updatePlanStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                />
                {planSteps.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removePlanStep(index)}
                    className="shrink-0"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addPlanStep} 
              className="w-full mt-2"
            >
              Add Step
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreatePlan}>Create Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
