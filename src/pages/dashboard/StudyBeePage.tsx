
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pageTransitions } from "@/lib/transitions";

export default function StudyBeePage() {
  return (
    <div className={`container mx-auto py-6 space-y-6 ${pageTransitions.initial}`}>
      <div className="flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Study Bee</h1>
          <p className="text-muted-foreground">Your personal study companion</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Study Bee</CardTitle>
          <CardDescription>
            Enhance your learning experience with personalized study tools and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Study Sessions</CardTitle>
                <CardDescription>Track your study time and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Session</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flashcards</CardTitle>
                <CardDescription>Create and review flashcard decks</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Decks</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Notes</CardTitle>
                <CardDescription>Organize and access your notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Open Notes</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
