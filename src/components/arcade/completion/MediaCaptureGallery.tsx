
import React from "react";

interface MediaCaptureGalleryProps {
  mediaCaptures: string[];
}

export function MediaCaptureGallery({ mediaCaptures }: MediaCaptureGalleryProps) {
  if (!mediaCaptures || mediaCaptures.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Captured Evidence</h4>
      <div className="grid grid-cols-2 gap-2">
        {mediaCaptures.map((src, index) => (
          <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden">
            <img 
              src={src} 
              alt={`Challenge evidence ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
