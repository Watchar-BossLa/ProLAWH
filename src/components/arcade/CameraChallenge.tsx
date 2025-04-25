
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface CameraChallengeProps {
  challenge: {
    id: string;
    validation_rules: {
      required_items: string[];
      min_confidence?: number;
    };
    points: number;
  };
  onComplete: (success: boolean, data: Record<string, any>, points: number) => void;
}

export default function CameraChallenge({ challenge, onComplete }: CameraChallengeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [detectedObjects, setDetectedObjects] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Required items from the challenge
  const requiredItems = challenge.validation_rules.required_items || [];
  const minConfidence = challenge.validation_rules.min_confidence || 0.7;
  
  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera Error",
          description: "Failed to access camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    
    startCamera();
    
    // Cleanup function to stop camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture image from video
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImages(prev => [...prev, imageDataUrl]);
    
    // Mock object detection (in a real app, this would use a proper model)
    processImage(imageDataUrl);
  };
  
  // Process image to detect objects (simplified mock version)
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    try {
      // In a real application, this would call an AI service to identify objects
      // For this demo, we'll randomly "detect" items from the required list
      
      // Simulating API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly "detect" an object from the required list that hasn't been detected yet
      const undetectedItems = requiredItems.filter(item => !detectedObjects.has(item));
      
      if (undetectedItems.length > 0 && Math.random() > 0.3) { // 70% chance of detection
        const randomIndex = Math.floor(Math.random() * undetectedItems.length);
        const detectedItem = undetectedItems[randomIndex];
        
        const newDetectedObjects = new Set(detectedObjects);
        newDetectedObjects.add(detectedItem);
        setDetectedObjects(newDetectedObjects);
        
        toast({
          title: "Object Detected!",
          description: `Found: ${detectedItem}`,
        });
        
        // Check if all required items have been found
        if (newDetectedObjects.size === requiredItems.length) {
          // Challenge completed successfully
          onComplete(true, {
            images: capturedImages,
            detected_objects: Array.from(newDetectedObjects)
          }, challenge.points);
        }
      } else {
        // Failed to detect an object
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
  
  // Give up on challenge
  const handleGiveUp = () => {
    onComplete(false, {
      images: capturedImages,
      detected_objects: Array.from(detectedObjects)
    }, 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">Find these items:</h3>
        <ul className="grid grid-cols-2 gap-2">
          {requiredItems.map(item => (
            <li 
              key={item}
              className={`flex items-center p-2 rounded ${
                detectedObjects.has(item) ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <span className={`mr-2 ${
                detectedObjects.has(item) ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                {detectedObjects.has(item) ? '✓' : '○'} 
              </span>
              <span className="capitalize">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover"
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2">Analyzing image...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button onClick={handleGiveUp} variant="outline">
          Give Up
        </Button>
        
        <Button 
          onClick={captureImage} 
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Capture Image
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {capturedImages.map((image, index) => (
          <div key={index} className="relative w-20 h-20">
            <img 
              src={image} 
              alt={`Captured ${index}`} 
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
