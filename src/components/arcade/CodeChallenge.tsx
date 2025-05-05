
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Challenge, TestCase } from "@/types/arcade";
import { Badge } from "@/components/ui/badge"; 
import { Check, Play, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeChallengeProps {
  challenge: Pick<Challenge, 'id' | 'validation_rules' | 'points'>;
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

// Simple code evaluation function
// In a real application, this would be done securely on the server
const evaluateCode = (code: string, testCase: TestCase): TestResult => {
  try {
    // This is a very simplified version - in production you'd use a secure evaluation method
    // like WebAssembly or a server-side execution environment
    const wrappedCode = `
      try {
        const userFunction = (input) => {
          ${code}
          return input;  // Default fallback if no return statement
        };
        return userFunction(\`${testCase.input}\`);
      } catch (error) {
        throw new Error(error.message);
      }
    `;

    // WARNING: Never use eval in production code!
    // This is only for demonstration purposes
    const result = Function(wrappedCode)();
    const stringResult = String(result).trim();
    const expectedOutput = testCase.expected_output.trim();
    
    return {
      passed: stringResult === expectedOutput,
      input: testCase.input,
      expected: expectedOutput,
      actual: stringResult,
    };
  } catch (error) {
    return {
      passed: false,
      input: testCase.input,
      expected: testCase.expected_output,
      actual: "",
      error: (error as Error).message,
    };
  }
};

export function CodeChallenge({ challenge, onComplete }: CodeChallengeProps) {
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const testCases = challenge.validation_rules.test_cases || [];
  
  const runTests = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code before running tests",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const results = testCases.map(testCase => evaluateCode(code, testCase));
      setTestResults(results);
    } catch (error) {
      console.error("Error running tests:", error);
      toast({
        title: "Error",
        description: "An error occurred while testing your code",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmit = () => {
    if (!code.trim()) {
      toast({
        title: "Empty Code",
        description: "Please write some code before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const results = testCases.map(testCase => evaluateCode(code, testCase));
      setTestResults(results);
      
      // Check if all tests passed
      const allPassed = results.every(r => r.passed);
      const earnedPoints = allPassed ? challenge.points : 0;
      
      // Submit results
      onComplete(
        allPassed,
        { code, testResults: results },
        earnedPoints
      );
    } catch (error) {
      console.error("Error submitting code:", error);
      toast({
        title: "Error",
        description: "An error occurred while evaluating your code",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Write your code solution:</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="// Write your code here..."
            className="font-mono h-64 resize-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </CardContent>
      </Card>
      
      <div className="flex flex-col space-y-4">
        {testCases.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cases">
                <TabsList className="mb-4">
                  <TabsTrigger value="cases">Test Cases</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="cases" className="space-y-4">
                  {testCases.map((testCase, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <p className="font-medium text-sm">{testCase.description || `Test Case ${index + 1}`}</p>
                      <div className="mt-2 space-y-1">
                        <div>
                          <span className="text-xs font-semibold">Input:</span>
                          <code className="ml-2 text-xs bg-muted p-1 rounded">{testCase.input}</code>
                        </div>
                        <div>
                          <span className="text-xs font-semibold">Expected Output:</span>
                          <code className="ml-2 text-xs bg-muted p-1 rounded">{testCase.expected_output}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="results">
                  {testResults.length > 0 ? (
                    <div className="space-y-4">
                      {testResults.map((result, index) => (
                        <div key={index} className={`p-3 border rounded-md ${result.passed ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}>
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                            <p className="font-medium text-sm">
                              {result.passed ? 'Passed' : 'Failed'}: Test Case {index + 1}
                            </p>
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <div>
                              <span className="text-xs font-semibold">Input:</span>
                              <code className="ml-2 text-xs bg-muted p-1 rounded">{result.input}</code>
                            </div>
                            <div>
                              <span className="text-xs font-semibold">Expected Output:</span>
                              <code className="ml-2 text-xs bg-muted p-1 rounded">{result.expected}</code>
                            </div>
                            <div>
                              <span className="text-xs font-semibold">Your Output:</span>
                              <code className="ml-2 text-xs bg-muted p-1 rounded">{result.actual || 'No output'}</code>
                            </div>
                            {result.error && (
                              <div>
                                <span className="text-xs font-semibold text-red-500">Error:</span>
                                <code className="ml-2 text-xs bg-muted p-1 rounded text-red-500">{result.error}</code>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Run your code to see test results.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={runTests}
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Play className="mr-2 h-4 w-4" />
            Run Tests
          </Button>
          
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CodeChallenge;
