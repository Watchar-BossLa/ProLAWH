
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseARSupportResult {
  isARSupported: boolean | null;
  sessionError: string | null;
  checkARSupport: () => Promise<void>;
}

export function useARSupport(): UseARSupportResult {
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkARSupport = async () => {
    if ("xr" in navigator) {
      try {
        // @ts-ignore - XR API may not be fully typed
        const isSupported = await navigator.xr?.isSessionSupported("immersive-ar");
        setIsARSupported(isSupported);
        
        if (isSupported) {
          toast({
            title: "AR Support Detected",
            description: "Your device supports AR experiences",
          });
        } else {
          toast({
            title: "AR Not Supported",
            description: "Your device doesn't support AR. Using simulation mode instead",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking AR support:", error);
        setIsARSupported(false);
        setSessionError("Could not verify AR capabilities");
      }
    } else {
      setIsARSupported(false);
      setSessionError("WebXR not available in this browser");
    }
  };

  useEffect(() => {
    checkARSupport();
  }, []);

  return { isARSupported, sessionError, checkARSupport };
}
