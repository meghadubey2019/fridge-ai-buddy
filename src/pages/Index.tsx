import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/ui/step-indicator";
import { ImageUpload } from "@/components/image-upload";
import { FoodDetection } from "@/components/food-detection";
import { CoolerRecommendations } from "@/components/cooler-recommendations";
import { SettingsApplication } from "@/components/settings-application";
import { RefreshCw } from "lucide-react";
import eliwellLogo from "@/assets/eliwell-logo.jpg";

interface DetectedItem {
  name: string;
  quantity: string;
  confidence: number;
  category: "meat" | "dairy" | "vegetables" | "fruits" | "beverages" | "other";
}

interface Recommendation {
  settings: {
    temperature: number;
    humidity: number;
    airflow: number;
    defrostCycle: number;
    energyMode: "eco" | "standard" | "performance";
  };
  reasoning: string[];
  energyEfficiency: number;
  foodPreservation: number;
  estimatedSavings: string;
}

const steps = ["Upload Images", "Review Detection", "AI Recommendations", "Apply Settings"];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const handleImagesUploaded = (images: File[]) => {
    setUploadedImages(images);
  };

  const handleContinueToDetection = () => {
    if (uploadedImages.length > 0) {
      setCurrentStep(1);
    }
  };

  const handleDetectionComplete = (items: DetectedItem[]) => {
    setDetectedItems(items);
    setCurrentStep(2);
  };

  const handleRecommendationAccept = (rec: Recommendation) => {
    setRecommendation(rec);
    setCurrentStep(3);
  };

  const handleComplete = () => {
    // Reset to start
    setCurrentStep(0);
    setUploadedImages([]);
    setDetectedItems([]);
    setRecommendation(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ImageUpload 
            onImagesChange={handleImagesUploaded} 
            onContinue={handleContinueToDetection}
          />
        );
      case 1:
        return (
          <FoodDetection
            images={uploadedImages}
            onDetectionComplete={handleDetectionComplete}
          />
        );
      case 2:
        return (
          <CoolerRecommendations
            detectedItems={detectedItems}
            onRecommendationAccept={handleRecommendationAccept}
          />
        );
      case 3:
        return recommendation ? (
          <SettingsApplication
            recommendation={recommendation}
            onComplete={handleComplete}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={eliwellLogo}
                alt="Eliwell Air"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Eliwell SmartCooler AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered refrigerator optimization
                </p>
              </div>
            </div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(0);
                  setUploadedImages([]);
                  setDetectedItems([]);
                  setRecommendation(null);
                }}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StepIndicator steps={steps} currentStep={currentStep} />
          
          <div className="animate-fade-in">
            {renderCurrentStep()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Powered by Eliwell Air Solution • AI-driven food preservation technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
