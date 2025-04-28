
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ArcadeIntro() {
  return (
    <Alert className="mb-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Quick AR/Camera Challenges</AlertTitle>
      <AlertDescription>
        Complete 60-second AR challenges to validate your technical skills. 
        Use your camera to demonstrate knowledge of Python, Rust, Kubernetes, and more.
        Earn verifiable credentials upon completion!
      </AlertDescription>
    </Alert>
  );
}
