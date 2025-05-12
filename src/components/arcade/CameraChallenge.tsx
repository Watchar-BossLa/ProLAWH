
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CameraView } from "./camera/CameraView";
import { RequiredItemsList } from "./camera/RequiredItemsList";
import { CapturedImagesGallery } from "./camera/CapturedImagesGallery";
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle2, XCircle } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useChallengeState } from "@/hooks/useChallengeState";
import { toast } from "@/hooks/use-toast";

interface CameraChallengeProps {
  requiredItems: string[];
  onComplete: (captures: string[]) => void;
  minCaptures?: number;
}

export function CameraChallenge({ 
  requiredItems, 
  onComplete,
  minCaptures = 1
}: CameraChallengeProps) {
  const { videoRef, captureImage, startCamera, stopCamera, detectedObjects, isDetecting } = useCamera();
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [detectionResults, setDetectionResults] = useState<Record<string, boolean>>({});
  const { state, setState } = useChallengeState();
  const [cameraReady, setCameraReady] = useState(false);
  
  // Start camera when component mounts
  useEffect(() => {
    const initCamera = async () => {
      try {
        await startCamera();
        setCameraReady(true);
      } catch (error) {
        console.error("Failed to initialize camera:", error);
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive"
        });
      }
    };
    
    if (state === 'active') {
      initCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera, state]);
  
  // Update detection results when detectedObjects changes
  useEffect(() => {
    if (detectedObjects.length > 0) {
      const newResults = { ...detectionResults };
      
      requiredItems.forEach(item => {
        // Check if item is detected
        const isDetected = detectedObjects.some(
          obj => obj.label.toLowerCase() === item.toLowerCase() && obj.confidence > 0.7
        );
        
        if (isDetected) {
          newResults[item] = true;
        }
      });
      
      setDetectionResults(newResults);
    }
  }, [detectedObjects, requiredItems]);
  
  // Check if all required items are detected
  const allItemsDetected = requiredItems.every(item => detectionResults[item]);
  
  // Handler for capturing an image
  const handleCapture = async () => {
    if (!videoRef.current) return;
    
    const imageSrc = await captureImage();
    if (imageSrc) {
      setCapturedImages(prev => [...prev, imageSrc]);
      
      toast({
        title: "Image Captured",
        description: `${capturedImages.length + 1}/${minCaptures} images taken`,
      });
      
      // Vibrate device if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };
  
  // Handler for completing the challenge
  const handleComplete = () => {
    if (capturedImages.length < minCaptures) {
      toast({
        title: "More Images Required",
        description: `Please capture at least ${minCaptures} images`,
        variant: "destructive"
      });
      return;
    }
    
    onComplete(capturedImages);
  };
  
  // Check if all requirements are met
  const isCompletable = capturedImages.length >= minCaptures;
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Camera Challenge</h3>
            <p className="text-sm text-muted-foreground">
              Find and photograph the required items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <CameraView 
                ref={videoRef} 
                detectedObjects={detectedObjects}
                isDetecting={isDetecting}
              />
              
              {cameraReady && (
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm">
                    {capturedImages.length}/{minCaptures} images
                  </span>
                  
                  <Button 
                    onClick={handleCapture}
                    disabled={!cameraReady}
                    aria-label="Capture photo"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <RequiredItemsList 
                items={requiredItems} 
                detectionResults={detectionResults} 
              />
              
              {allItemsDetected && (
                <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-3 border border-green-200 dark:border-green-900 flex items-center gap-2 text-green-800 dark:text-green-300">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">All items detected!</span>
                </div>
              )}
              
              {!allItemsDetected && isDetecting && (
                <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 border border-blue-200 dark:border-blue-900 flex items-center gap-2 text-blue-800 dark:text-blue-300">
                  <span className="text-sm">Looking for objects...</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {capturedImages.length > 0 && (
        <CapturedImagesGallery 
          images={capturedImages} 
          onDelete={(index) => {
            setCapturedImages(prev => prev.filter((_, i) => i !== index));
          }}
        />
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={handleComplete}
          disabled={!isCompletable}
          className="px-8"
        >
          {isCompletable ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit Challenge
            </>
          ) : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Need {minCaptures - capturedImages.length} More Photos
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
