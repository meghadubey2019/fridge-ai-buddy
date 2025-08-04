import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Wifi, Settings, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

interface SettingsApplicationProps {
  recommendation: Recommendation;
  onComplete: () => void;
}

// Mock Eliwell Air API connection
const applyToEliwellAir = async (settings: Recommendation["settings"]): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
  
  // Simulate 90% success rate
  return Math.random() > 0.1;
};

export function SettingsApplication({ recommendation, onComplete }: SettingsApplicationProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle");
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    setConnectionStatus("connecting");
    
    try {
      const success = await applyToEliwellAir(recommendation.settings);
      
      if (success) {
        setConnectionStatus("success");
        setApplied(true);
        toast.success("Settings successfully applied to your Eliwell Air cooler!");
      } else {
        setConnectionStatus("error");
        toast.error("Failed to connect to Eliwell Air system. Please check your connection.");
      }
    } catch (error) {
      setConnectionStatus("error");
      toast.error("Failed to apply settings. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleReject = () => {
    toast.info("Recommendations rejected. You can upload new images to get different suggestions.");
    onComplete();
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "error":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Wifi className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getConnectionMessage = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting to Eliwell Air system...";
      case "success":
        return "Successfully connected to Eliwell Air";
      case "error":
        return "Failed to connect to Eliwell Air system";
      default:
        return "Ready to connect to Eliwell Air";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Apply Settings to Eliwell Air</h3>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-3">Recommended Settings Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Temperature:</span>
              <div className="font-medium">{recommendation.settings.temperature}°C</div>
            </div>
            <div>
              <span className="text-muted-foreground">Humidity:</span>
              <div className="font-medium">{recommendation.settings.humidity}%</div>
            </div>
            <div>
              <span className="text-muted-foreground">Airflow:</span>
              <div className="font-medium">{recommendation.settings.airflow}%</div>
            </div>
            <div>
              <span className="text-muted-foreground">Defrost:</span>
              <div className="font-medium">{recommendation.settings.defrostCycle}h</div>
            </div>
            <div>
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline" className="mt-1">
                {recommendation.settings.energyMode}
              </Badge>
            </div>
          </div>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex items-center gap-3">
            {getConnectionIcon()}
            <div className="flex-1">
              <div className="font-medium">{getConnectionMessage()}</div>
              {connectionStatus === "error" && (
                <div className="text-sm text-muted-foreground">
                  Please ensure your Eliwell Air system is online and accessible.
                </div>
              )}
            </div>
            {connectionStatus === "success" && (
              <Badge className="bg-success/20 text-success border-success/30">
                Connected
              </Badge>
            )}
          </div>
        </Card>

        {applied && (
          <Card className="p-4 mb-6 bg-success/5 border-success/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div>
                <div className="font-medium text-success">Settings Applied Successfully!</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your Eliwell Air cooler has been updated with the optimized settings. 
                  You should see improved food preservation and energy efficiency.
                </div>
              </div>
            </div>
          </Card>
        )}

        {connectionStatus === "error" && (
          <Card className="p-4 mb-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-destructive">Connection Failed</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Unable to connect to your Eliwell Air system. Please check:
                </div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Network connectivity</li>
                  <li>• Eliwell Air system is powered on</li>
                  <li>• System is not in maintenance mode</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-3 justify-center">
          {!applied && (
            <>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isApplying}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject Recommendations
              </Button>
              
              <Button
                onClick={handleApply}
                disabled={isApplying || connectionStatus === "success"}
                className="gap-2"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying Settings...
                  </>
                ) : connectionStatus === "success" ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Settings Applied
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    Apply to Eliwell Air
                  </>
                )}
              </Button>
            </>
          )}
          
          {connectionStatus === "error" && (
            <Button
              variant="outline"
              onClick={handleApply}
              disabled={isApplying}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </Button>
          )}
          
          {applied && (
            <Button onClick={onComplete} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Complete
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}