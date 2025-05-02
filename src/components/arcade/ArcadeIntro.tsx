
import { AlertCircle, Zap, Trophy, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export function ArcadeIntro() {
  return (
    <div className="space-y-6">
      <Alert className="bg-indigo-50 dark:bg-indigo-950/20">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-semibold">Quick AR/Camera Challenges</AlertTitle>
        <AlertDescription>
          Complete 60-second AR challenges to validate your technical skills. 
          Use your camera to demonstrate knowledge of Python, Rust, Kubernetes, and more.
          Earn verifiable credentials upon completion!
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold">Quick Validation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Show your skills in just 60 seconds with our camera-based verification system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-emerald-500" />
              <h3 className="font-semibold">Earn Credentials</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Each completed challenge adds verified skills to your ProLawh profile
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Learn Efficiently</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Focus on what matters with timed challenges that test practical knowledge
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
