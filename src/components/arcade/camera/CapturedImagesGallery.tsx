
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CapturedImagesGalleryProps {
  images: string[];
  onDelete: (index: number) => void;
}

export function CapturedImagesGallery({ 
  images, 
  onDelete 
}: CapturedImagesGalleryProps) {
  if (!images || images.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Captured Images</h3>
        <span className="text-xs text-muted-foreground">{images.length} images</span>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex p-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative shrink-0 overflow-hidden rounded-md">
              <div className="aspect-square h-32 w-32 overflow-hidden">
                <img
                  src={image}
                  alt={`Captured image ${index + 1}`}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                  loading="lazy"
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-70 hover:opacity-100"
                onClick={() => onDelete(index)}
                aria-label={`Delete image ${index + 1}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
