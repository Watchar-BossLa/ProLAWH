
import { forwardRef, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from "lucide-react";

interface DetectedObject {
  label: string;
  confidence: number;
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface CameraViewProps {
  detectedObjects?: DetectedObject[];
  isDetecting?: boolean;
}

export const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ detectedObjects = [], isDetecting = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    
    // Update overlay positions when video or detected objects change
    useEffect(() => {
      if (!overlayRef.current || !containerRef.current) return;
      
      const updateOverlaySize = () => {
        if (overlayRef.current && containerRef.current) {
          overlayRef.current.style.width = `${containerRef.current.offsetWidth}px`;
          overlayRef.current.style.height = `${containerRef.current.offsetHeight}px`;
        }
      };
      
      updateOverlaySize();
      window.addEventListener('resize', updateOverlaySize);
      
      return () => {
        window.removeEventListener('resize', updateOverlaySize);
      };
    }, []);
    
    return (
      <Card className="relative overflow-hidden bg-black aspect-video">
        <div ref={containerRef} className="relative w-full h-full">
          <video
            ref={ref}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {/* AR Object Detection Overlay */}
          <div
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            {detectedObjects.map((obj, index) => {
              if (!obj.bbox) return null;
              
              const { x, y, width, height } = obj.bbox;
              
              return (
                <div
                  key={index}
                  className="absolute border-2 border-green-500 bg-green-500/20 rounded-md"
                  style={{
                    left: `${x * 100}%`,
                    top: `${y * 100}%`,
                    width: `${width * 100}%`,
                    height: `${height * 100}%`,
                  }}
                >
                  <div className="absolute top-0 left-0 transform -translate-y-full bg-green-500 text-white text-xs px-1 py-0.5 rounded-t-sm whitespace-nowrap">
                    {obj.label} {Math.round(obj.confidence * 100)}%
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Detection Indicator */}
          {isDetecting && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Loader2 className="animate-spin h-3 w-3 mr-1" />
              <span>Scanning</span>
            </div>
          )}
        </div>
      </Card>
    );
  }
);

CameraView.displayName = 'CameraView';
