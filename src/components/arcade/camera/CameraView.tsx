
import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isProcessing: boolean;
  onCapture: () => void;
}

export function CameraView({ 
  videoRef, 
  canvasRef, 
  isProcessing, 
  onCapture 
}: CameraViewProps) {
  return (
    <div className="space-y-4">
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
      
      <Button 
        onClick={onCapture} 
        disabled={isProcessing}
        className="flex items-center gap-2"
      >
        <Camera className="h-4 w-4" />
        Capture Image
      </Button>
    </div>
  );
}
