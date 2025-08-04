import { useState, useCallback } from "react";
import { Upload, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ onImagesChange, maxImages = 3 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/")
      );

      const newImages = [...images, ...files].slice(0, maxImages);
      setImages(newImages);
      onImagesChange(newImages);
    },
    [images, maxImages, onImagesChange]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const newImages = [...images, ...files].slice(0, maxImages);
      setImages(newImages);
      onImagesChange(newImages);
    },
    [images, maxImages, onImagesChange]
  );

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange(newImages);
    },
    [images, onImagesChange]
  );

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 hover:border-primary/50",
          dragOver ? "border-primary bg-primary/5" : "border-border",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="p-8 text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            Upload Refrigerator Images
          </h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop up to {maxImages} images of your refrigerator interior,
            or click to browse
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={images.length >= maxImages}
          />
          <Button asChild variant="outline" className="gap-2">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose Images
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            {images.length}/{maxImages} images uploaded
          </p>
        </div>
      </Card>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
                    className="gap-1"
                  >
                    <X className="w-3 h-3" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {image.name}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}