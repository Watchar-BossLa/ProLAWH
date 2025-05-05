
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Challenge, Question } from "@/types/arcade";

interface QuizChallengeProps {
  challenge: Pick<Challenge, 'id' | 'validation_rules' | 'points' | 'questions'>;
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

export function QuizChallenge({ challenge, onComplete }: QuizChallengeProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure we have questions to display
  const questions = challenge.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (!answers[currentQuestion.id]) {
      toast({
        title: "Required",
        description: "Please provide an answer before continuing",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const validateAnswers = (): { correct: boolean; score: number } => {
    const correctAnswers = challenge.validation_rules.correct_answers || {};
    let correctCount = 0;
    
    // Check each answer against correct answers
    Object.entries(answers).forEach(([questionId, userAnswer]) => {
      const correctAnswer = correctAnswers[questionId];
      
      // Handle both string and array of acceptable answers
      if (Array.isArray(correctAnswer)) {
        if (correctAnswer.includes(userAnswer)) {
          correctCount++;
        }
      } else if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    // Calculate score based on percentage correct
    const percentageCorrect = (correctCount / questions.length) * 100;
    const isCorrect = percentageCorrect >= 70; // 70% to pass
    const earnedPoints = isCorrect ? challenge.points : 0;
    
    return {
      correct: isCorrect,
      score: earnedPoints
    };
  };

  const handleSubmit = () => {
    // Validate that all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete",
        description: `Please answer all questions before submitting.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = validateAnswers();
      
      // Submit the results
      onComplete(
        result.correct,
        { answers },
        result.score
      );
    } catch (error) {
      console.error("Error validating quiz:", error);
      toast({
        title: "Error",
        description: "An error occurred while validating your answers.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle case where there are no questions
  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No questions available for this challenge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          {/* Question counter */}
          <div className="text-sm text-muted-foreground mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          {/* Current question */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
            
            {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
              <RadioGroup 
                value={answers[currentQuestion.id] || ""} 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
            
            {currentQuestion.type === "text" && (
              <Input 
                type="text" 
                placeholder="Enter your answer" 
                value={answers[currentQuestion.id] || ""} 
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} 
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation controls */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNextQuestion}>Next</Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            Submit All Answers
          </Button>
        )}
      </div>
    </div>
  );
}

export default QuizChallenge;
