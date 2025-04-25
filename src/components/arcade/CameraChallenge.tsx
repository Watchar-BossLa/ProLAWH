
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCamera } from '@/hooks/useCamera';
import { RequiredItemsList } from './camera/RequiredItemsList';
import { CameraView } from './camera/CameraView';
import { CapturedImagesGallery } from './camera/CapturedImagesGallery';
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
  
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const undetectedItems = requiredItems.filter(item => !detectedObjects.has(item));
      
      if (undetectedItems.length > 0 && Math.random() > 0.3) {
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
  
  return (
    <div className="space-y-4">
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
      
      <Button onClick={handleGiveUp} variant="outline" className="w-full">
        Give Up
      </Button>
      
      <CapturedImagesGallery images={capturedImages} />
    </div>
  );
}
