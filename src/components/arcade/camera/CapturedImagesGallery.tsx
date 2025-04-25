
interface CapturedImagesGalleryProps {
  images: string[];
}

export function CapturedImagesGallery({ images }: CapturedImagesGalleryProps) {
  if (images.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative w-20 h-20">
          <img 
            src={image} 
            alt={`Captured ${index}`} 
            className="w-full h-full object-cover rounded"
          />
        </div>
      ))}
    </div>
  );
}
