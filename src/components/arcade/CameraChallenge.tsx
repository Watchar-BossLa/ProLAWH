import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCamera } from '@/hooks/useCamera';
import { RequiredItemsList } from './camera/RequiredItemsList';
import { CameraView } from './camera/CameraView';
import { CapturedImagesGallery } from './camera/CapturedImagesGallery';
import { Progress } from '@/components/ui/progress';
import type { ChallengeValidationRules } from '@/types/arcade';

interface CameraChallengeProps {
  challenge: {
    id: string;
    validation_rules: ChallengeValidationRules;
    points: number;
  };
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

export default function CameraChallenge({ challenge, onComplete }: CameraChallengeProps) {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [detectedObjects, setDetectedObjects] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { videoRef, canvasRef, captureImage } = useCamera();

  const requiredItems = challenge.validation_rules.required_items;
  const minConfidence = challenge.validation_rules.min_confidence || 0.7;
  
  // For testing purposes - simulate progressively better detection
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const undetectedItems = requiredItems.filter(item => !detectedObjects.has(item));
      
      if (undetectedItems.length > 0) {
        // For testing, increase probability of detection to make testing easier
        if (Math.random() > 0.2) {
          // Pick a random undetected item
          const randomIndex = Math.floor(Math.random() * undetectedItems.length);
          const detectedItem = undetectedItems[randomIndex];
          
          const newDetectedObjects = new Set(detectedObjects);
          newDetectedObjects.add(detectedItem);
          setDetectedObjects(newDetectedObjects);
          
          toast({
            title: "Object Detected!",
            description: `Found: ${detectedItem}`,
          });
          
          if (newDetectedObjects.size === requiredItems.length) {
            toast({
              title: "Challenge Completed!",
              description: "Congratulations! All items detected.",
              variant: "default"
            });
            
            onComplete(true, {
              images: capturedImages,
              detected_objects: Array.from(newDetectedObjects)
            }, challenge.points);
          }
        } else {
          toast({
            title: "No Objects Detected",
            description: "Try a different angle or lighting",
          });
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    const imageDataUrl = captureImage();
    if (imageDataUrl) {
      setCapturedImages(prev => [...prev, imageDataUrl]);
      processImage(imageDataUrl);
    }
  };
  
  const handleGiveUp = () => {
    onComplete(false, {
      images: capturedImages,
      detected_objects: Array.from(detectedObjects)
    }, 0);
  };
  
  const detectionProgress = requiredItems.length > 0 
    ? (detectedObjects.size / requiredItems.length) * 100 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Detection Progress</h3>
        <Progress value={detectionProgress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {detectedObjects.size} of {requiredItems.length} items detected
        </p>
      </div>
      
      <RequiredItemsList 
        requiredItems={requiredItems} 
        detectedObjects={detectedObjects}
      />
      
      <CameraView
        videoRef={videoRef}
        canvasRef={canvasRef}
        isProcessing={isProcessing}
        onCapture={handleCapture}
      />
      
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleCapture} disabled={isProcessing} variant="default" className="w-full">
          {isProcessing ? "Processing..." : "Capture Image"}
        </Button>
        
        <Button onClick={handleGiveUp} variant="outline" className="w-full">
          Give Up
        </Button>
      </div>
      
      <CapturedImagesGallery images={capturedImages} />
      
      {/* Test Mode Controls - Makes testing easier */}
      <div className="border-t pt-4 mt-6">
        <h4 className="text-sm font-medium mb-2">Test Controls</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              // Simulate detecting one more item
              const undetectedItems = requiredItems.filter(item => !detectedObjects.has(item));
              if (undetectedItems.length > 0) {
                const newDetectedObjects = new Set(detectedObjects);
                newDetectedObjects.add(undetectedItems[0]);
                setDetectedObjects(newDetectedObjects);
                
                if (newDetectedObjects.size === requiredItems.length) {
                  onComplete(true, {
                    images: capturedImages,
                    detected_objects: Array.from(newDetectedObjects)
                  }, challenge.points);
                }
              }
            }}
          >
            Simulate Detection
          </Button>
          
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              // Complete the challenge
              const allItems = new Set(requiredItems);
              setDetectedObjects(allItems);
              onComplete(true, {
                images: capturedImages,
                detected_objects: Array.from(allItems)
              }, challenge.points);
            }}
          >
            Complete Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
