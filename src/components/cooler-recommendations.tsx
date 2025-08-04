import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Clock, Brain, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DetectedItem {
  name: string;
  quantity: string;
  confidence: number;
  category: "meat" | "dairy" | "vegetables" | "fruits" | "beverages" | "other";
}

interface CoolerSettings {
  temperature: number;
  humidity: number;
  airflow: number;
  defrostCycle: number;
  energyMode: "eco" | "standard" | "performance";
}

interface Recommendation {
  settings: CoolerSettings;
  reasoning: string[];
  energyEfficiency: number;
  foodPreservation: number;
  estimatedSavings: string;
}

interface CoolerRecommendationsProps {
  detectedItems: DetectedItem[];
  onRecommendationAccept: (recommendation: Recommendation) => void;
}

// Mock AI recommendation engine
const generateRecommendations = async (items: DetectedItem[]): Promise<Recommendation> => {
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate AI processing
  
  // Calculate optimal settings based on detected food types
  const hasPerishables = items.some(item => ["meat", "dairy"].includes(item.category));
  const hasVegetables = items.some(item => item.category === "vegetables");
  const hasFruits = items.some(item => item.category === "fruits");
  
  let temperature = 3; // Base temperature (°C)
  let humidity = 65; // Base humidity (%)
  let airflow = 60; // Base airflow (%)
  
  if (hasPerishables) {
    temperature = Math.max(1, temperature - 1);
    humidity = Math.min(70, humidity + 5);
  }
  
  if (hasVegetables) {
    humidity = Math.min(85, humidity + 10);
  }
  
  if (hasFruits) {
    airflow = Math.min(80, airflow + 15);
  }
  
  const settings: CoolerSettings = {
    temperature,
    humidity,
    airflow,
    defrostCycle: 8, // hours
    energyMode: hasPerishables ? "standard" : "eco",
  };
  
  const reasoning = [
    hasPerishables && "Lower temperature recommended for meat and dairy preservation",
    hasVegetables && "Increased humidity to prevent vegetable dehydration",
    hasFruits && "Enhanced airflow to prevent fruit ripening acceleration",
    `${settings.energyMode} energy mode selected for optimal efficiency`,
    `Defrost cycle set to ${settings.defrostCycle} hours based on usage pattern`,
  ].filter(Boolean) as string[];
  
  return {
    settings,
    reasoning,
    energyEfficiency: Math.floor(Math.random() * 15) + 85, // 85-100%
    foodPreservation: Math.floor(Math.random() * 10) + 90, // 90-100%
    estimatedSavings: `$${(Math.random() * 20 + 10).toFixed(0)}/month`,
  };
};

export function CoolerRecommendations({ detectedItems, onRecommendationAccept }: CoolerRecommendationsProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    generateRecommendations(detectedItems)
      .then(setRecommendation)
      .finally(() => setIsGenerating(false));
  }, [detectedItems]);

  if (isGenerating) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary animate-pulse-glow" />
            <Loader2 className="w-6 h-6 text-primary animate-spin ml-2" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Generating AI Recommendations</h3>
          <p className="text-muted-foreground mb-4">
            Analyzing your food inventory to optimize cooler settings for maximum freshness and energy efficiency...
          </p>
          <Progress value={75} className="w-64 mx-auto" />
        </div>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Generate Recommendations</h3>
          <p className="text-muted-foreground">
            Unable to process your food inventory. Please try again.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-primary">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary-foreground" />
          <h3 className="text-lg font-semibold text-primary-foreground">AI-Optimized Settings</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Thermometer className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary-foreground">
              {recommendation.settings.temperature}°C
            </div>
            <div className="text-sm text-primary-foreground/80">Temperature</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Droplets className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary-foreground">
              {recommendation.settings.humidity}%
            </div>
            <div className="text-sm text-primary-foreground/80">Humidity</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary-foreground">
              {recommendation.settings.airflow}%
            </div>
            <div className="text-sm text-primary-foreground/80">Airflow</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold text-primary-foreground">
              {recommendation.settings.defrostCycle}h
            </div>
            <div className="text-sm text-primary-foreground/80">Defrost Cycle</div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            {recommendation.settings.energyMode.toUpperCase()} Energy Mode
          </Badge>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-semibold mb-4">Why These Settings?</h4>
        <div className="space-y-2">
          {recommendation.reasoning.map((reason, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {recommendation.energyEfficiency}%
          </div>
          <div className="text-sm text-muted-foreground">Energy Efficiency</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary mb-1">
            {recommendation.foodPreservation}%
          </div>
          <div className="text-sm text-muted-foreground">Food Preservation</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {recommendation.estimatedSavings}
          </div>
          <div className="text-sm text-muted-foreground">Est. Monthly Savings</div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={() => onRecommendationAccept(recommendation)}
          className="gap-2 text-lg px-8 py-3"
          size="lg"
        >
          Apply These Settings
        </Button>
      </div>
    </div>
  );
}