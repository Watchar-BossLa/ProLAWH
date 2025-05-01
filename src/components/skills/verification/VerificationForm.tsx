
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSkillVerification, VerificationMethod, VerificationBackendType } from "@/hooks/useSkillVerification";
import { useGreenSkills } from "@/hooks/useGreenSkills";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  skillId: z.string().min(1, "Please select a skill"),
  method: z.string().min(1, "Please select a verification method"),
  evidence: z.any().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface VerificationFormProps {
  selectedMethod: VerificationMethod;
  onCancel: () => void;
}

export function VerificationForm({ selectedMethod, onCancel }: VerificationFormProps) {
  const { data: skills = [] } = useGreenSkills();
  const { submitVerification, isSubmittingVerification, convertMethodToType } = useSkillVerification();
  const [file, setFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillId: "",
      method: selectedMethod,
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = (values: FormValues) => {
    const backendType = convertMethodToType(values.method as VerificationMethod);
    
    submitVerification({
      type: backendType,
      source: values.skillId,
      evidence: file ? URL.createObjectURL(file) : values.evidence?.toString()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Skill</CardTitle>
        <CardDescription>
          Complete the verification process for your selected method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="skillId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Skill</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill to verify" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedMethod === "credential" && (
              <FormItem>
                <FormLabel>Upload Your Credential</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleFileChange} />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a certificate, diploma, or other credential document (PDF, JPG, PNG)
                </p>
                <FormMessage />
              </FormItem>
            )}

            {selectedMethod === "endorsement" && (
              <div className="space-y-4">
                <p className="text-sm">
                  Getting endorsed by industry experts requires you to share your
                  profile with them. We'll guide you through the process.
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={isSubmittingVerification}
        >
          {isSubmittingVerification ? "Processing..." : "Submit for Verification"}
        </Button>
      </CardFooter>
    </Card>
  );
}
