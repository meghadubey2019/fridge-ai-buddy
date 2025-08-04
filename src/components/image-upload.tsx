import { useState, useCallback } from "react";
import { Upload, X, Camera, Plus, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  onContinue?: () => void;
}

export function ImageUpload({ onImagesChange, maxImages = 3, onContinue }: ImageUploadProps) {
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Upload Your Refrigerator Images</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take clear photos of your refrigerator's interior to help our AI analyze your food inventory 
          and recommend optimal cooling settings for maximum freshness and energy efficiency.
        </p>
      </div>

      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 hover:border-primary/50 hover:bg-primary/5",
          dragOver ? "border-primary bg-primary/10 shadow-glow" : "border-border",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">
            {images.length === 0 ? "Choose Your Images" : "Add More Images"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {images.length === 0 
              ? "Drag and drop up to 3 images here, or click to browse your files"
              : `Add ${maxImages - images.length} more image${maxImages - images.length !== 1 ? 's' : ''} to complete your upload`
            }
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
          <Button asChild size="lg" className="gap-2 text-lg px-8">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="w-5 h-5" />
              {images.length === 0 ? "Choose Images" : "Add More Images"}
            </label>
          </Button>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
            <span>{images.length}/{maxImages} images selected</span>
            <span>•</span>
            <span>JPG, PNG up to 10MB each</span>
          </div>
        </div>
      </Card>

      {images.length > 0 && (
        <div className="animate-fade-in">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Your Selected Images</h3>
            <p className="text-muted-foreground">
              Review your images below. You can remove any image and add more if needed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <Card key={index} className="relative group overflow-hidden hover:shadow-elegant transition-all duration-300">
                <div className="aspect-[4/3] relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Refrigerator view ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="gap-1 shadow-lg"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
                      <span className="text-white text-sm font-medium">Image {index + 1}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </Card>
            ))}
            
            {/* Add more placeholder */}
            {images.length < maxImages && (
              <Card className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors duration-300">
                <div className="aspect-[4/3] flex items-center justify-center">
                  <div className="text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id={`image-upload-${images.length}`}
                    />
                    <label 
                      htmlFor={`image-upload-${images.length}`}
                      className="cursor-pointer flex flex-col items-center gap-2 p-8"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">Add Image</span>
                    </label>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={onContinue}
              size="lg" 
              className="gap-2 text-lg px-12 py-4 shadow-glow"
              disabled={images.length === 0}
            >
              <Brain className="w-5 h-5" />
              Analyze My Refrigerator
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Our AI will analyze your {images.length} image{images.length !== 1 ? 's' : ''} to detect food items and recommend optimal settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}