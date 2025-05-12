import { useState, useRef, useCallback, useEffect } from "react";

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

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const detectionIntervalRef = useRef<number | null>(null);
  
  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      streamRef.current = stream;
      setIsCameraActive(true);
      setPermissionDenied(false);
      
      // Start object detection
      startObjectDetection();
      
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionDenied(true);
      return false;
    }
  }, []);
  
  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    stopObjectDetection();
  }, []);
  
  // Capture image from video stream
  const captureImage = useCallback(async () => {
    if (!videoRef.current || !isCameraActive) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Simulate flash effect
    const flashElement = document.createElement('div');
    flashElement.style.position = 'fixed';
    flashElement.style.top = '0';
    flashElement.style.left = '0';
    flashElement.style.width = '100%';
    flashElement.style.height = '100%';
    flashElement.style.backgroundColor = 'white';
    flashElement.style.opacity = '0.7';
    flashElement.style.zIndex = '9999';
    flashElement.style.pointerEvents = 'none';
    flashElement.style.transition = 'opacity 0.2s ease-out';
    
    document.body.appendChild(flashElement);
    
    // Trigger detection on the captured image
    detectObjectsInImage(canvas);
    
    setTimeout(() => {
      flashElement.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(flashElement);
      }, 200);
    }, 50);
    
    return canvas.toDataURL('image/jpeg');
  }, [isCameraActive]);
  
  // Start object detection
  const startObjectDetection = useCallback(() => {
    // In a real implementation, this would use TensorFlow.js or a similar library
    // For this prototype, we'll simulate object detection with mock data
    setIsDetecting(true);
    
    detectionIntervalRef.current = window.setInterval(() => {
      if (!videoRef.current || !isCameraActive) return;
      
      // Simulate random object detection
      const possibleObjects = [
        { label: 'tree', confidence: 0.9 },
        { label: 'recycling', confidence: 0.85 },
        { label: 'solar panel', confidence: 0.78 },
        { label: 'bicycle', confidence: 0.92 },
        { label: 'reusable bag', confidence: 0.81 },
        { label: 'plant', confidence: 0.95 },
      ];
      
      // Randomly select 0-3 objects to "detect"
      const numObjects = Math.floor(Math.random() * 3);
      const detectedObjsArray: DetectedObject[] = [];
      
      for (let i = 0; i < numObjects; i++) {
        const randomIdx = Math.floor(Math.random() * possibleObjects.length);
        const obj = possibleObjects[randomIdx];
        
        // Add random bounding box
        const x = Math.random() * 0.8;
        const y = Math.random() * 0.8;
        const width = Math.random() * 0.3 + 0.1;
        const height = Math.random() * 0.3 + 0.1;
        
        detectedObjsArray.push({
          ...obj,
          bbox: { x, y, width, height }
        });
      }
      
      setDetectedObjects(detectedObjsArray);
    }, 2000);
  }, [isCameraActive]);
  
  // Stop object detection
  const stopObjectDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
    setDetectedObjects([]);
  }, []);
  
  // Detect objects in a captured image
  const detectObjectsInImage = useCallback((canvas: HTMLCanvasElement) => {
    // In a real implementation, this would process the image with a model
    // For this prototype, we'll simulate detection
    
    // Simulate processing by simply keeping the current detections
    // In a real app, we would analyze the image and update detections
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopObjectDetection();
    };
  }, [stopCamera, stopObjectDetection]);
  
  return {
    videoRef,
    isCameraActive,
    permissionDenied,
    captureImage,
    startCamera,
    stopCamera,
    detectedObjects,
    isDetecting
  };
}
