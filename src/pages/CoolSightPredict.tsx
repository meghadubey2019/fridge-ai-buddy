import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { AlertTriangle, Thermometer, Droplets, Settings, Activity, Clock, Wrench } from "lucide-react";
import eliwellLogo from "@/assets/eliwell-logo.jpg";

// Mock data for 3 coolers
const coolersData = {
  "cooler-1": {
    id: "cooler-1",
    name: "Cooler Unit A - Produce Storage",
    location: "Warehouse Section 1",
    healthScore: 85,
    status: "good",
    estimatedTimeToFailure: "6 months",
    currentTemp: -2.5,
    currentHumidity: 65,
    compressorCycles: 142,
    lastDefrost: "2 hours ago",
    recommendations: [
      "Schedule routine cleaning in 2 weeks",
      "Monitor humidity levels closely",
      "Replace air filter in 1 month"
    ],
    telemetryData: [
      { time: "00:00", temperature: -2.8, humidity: 63, compressorCycles: 138 },
      { time: "04:00", temperature: -2.5, humidity: 65, compressorCycles: 140 },
      { time: "08:00", temperature: -2.3, humidity: 67, compressorCycles: 142 },
      { time: "12:00", temperature: -2.5, humidity: 65, compressorCycles: 144 },
      { time: "16:00", temperature: -2.7, humidity: 64, compressorCycles: 146 },
      { time: "20:00", temperature: -2.5, humidity: 65, compressorCycles: 142 }
    ]
  },
  "cooler-2": {
    id: "cooler-2",
    name: "Cooler Unit B - Dairy Products",
    location: "Warehouse Section 2",
    healthScore: 45,
    status: "warning",
    estimatedTimeToFailure: "3 weeks",
    currentTemp: 1.2,
    currentHumidity: 78,
    compressorCycles: 289,
    lastDefrost: "8 hours ago",
    recommendations: [
      "URGENT: Schedule maintenance within 48 hours",
      "Replace compressor seal",
      "Calibrate temperature sensors",
      "Clean condenser coils"
    ],
    telemetryData: [
      { time: "00:00", temperature: 0.8, humidity: 75, compressorCycles: 285 },
      { time: "04:00", temperature: 1.1, humidity: 77, compressorCycles: 287 },
      { time: "08:00", temperature: 1.3, humidity: 79, compressorCycles: 289 },
      { time: "12:00", temperature: 1.5, humidity: 80, compressorCycles: 291 },
      { time: "16:00", temperature: 1.2, humidity: 78, compressorCycles: 289 },
      { time: "20:00", temperature: 1.0, humidity: 76, compressorCycles: 287 }
    ]
  },
  "cooler-3": {
    id: "cooler-3",
    name: "Cooler Unit C - Frozen Goods",
    location: "Warehouse Section 3",
    healthScore: 92,
    status: "excellent",
    estimatedTimeToFailure: "12+ months",
    currentTemp: -18.5,
    currentHumidity: 45,
    compressorCycles: 98,
    lastDefrost: "1 day ago",
    recommendations: [
      "Continue current maintenance schedule",
      "Monitor for optimal performance",
      "Next scheduled maintenance in 3 months"
    ],
    telemetryData: [
      { time: "00:00", temperature: -18.3, humidity: 44, compressorCycles: 96 },
      { time: "04:00", temperature: -18.5, humidity: 45, compressorCycles: 97 },
      { time: "08:00", temperature: -18.4, humidity: 46, compressorCycles: 98 },
      { time: "12:00", temperature: -18.6, humidity: 45, compressorCycles: 99 },
      { time: "16:00", temperature: -18.5, humidity: 44, compressorCycles: 98 },
      { time: "20:00", temperature: -18.3, humidity: 45, compressorCycles: 97 }
    ]
  }
};

const getHealthColor = (score: number) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
};

const getStatusBadge = (status: string) => {
  const variants = {
    excellent: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    good: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    critical: "bg-red-500/20 text-red-400 border-red-500/30"
  };
  
  return (
    <Badge className={variants[status as keyof typeof variants] || variants.good}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function CoolSightPredict() {
  const [selectedCooler, setSelectedCooler] = useState<string>("cooler-1");
  const currentCooler = coolersData[selectedCooler as keyof typeof coolersData];

  const handleCoolerCommand = (command: string) => {
    // Mock command execution
    console.log(`Executing command: ${command} on ${currentCooler.name}`);
    // In real implementation, this would send commands to the cooler
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={eliwellLogo} 
                alt="Eliwell" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary">CoolSight Predict</h1>
                <p className="text-sm text-muted-foreground">Predictive Maintenance for Industrial Refrigeration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Activity className="h-5 w-5 text-emerald-400" />
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Cooler Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Select Cooler Unit</h2>
          <Select value={selectedCooler} onValueChange={setSelectedCooler}>
            <SelectTrigger className="w-full max-w-md bg-card border-border">
              <SelectValue placeholder="Choose a cooler unit" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {Object.values(coolersData).map((cooler) => (
                <SelectItem key={cooler.id} value={cooler.id}>
                  <div className="flex items-center gap-2">
                    <span>{cooler.name}</span>
                    {getStatusBadge(cooler.status)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Dashboard */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Health Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Health Overview
                </CardTitle>
                <CardDescription>{currentCooler.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getHealthColor(currentCooler.healthScore)}`}>
                    {currentCooler.healthScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                  <Progress 
                    value={currentCooler.healthScore} 
                    className="mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <Thermometer className="h-6 w-6 mx-auto mb-1 text-blue-400" />
                    <div className="text-lg font-semibold">{currentCooler.currentTemp}°C</div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="h-6 w-6 mx-auto mb-1 text-cyan-400" />
                    <div className="text-lg font-semibold">{currentCooler.currentHumidity}%</div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Time to Failure</span>
                  </div>
                  <div className="text-lg font-semibold">{currentCooler.estimatedTimeToFailure}</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Controls */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => handleCoolerCommand("adjust_temperature")}
                  className="w-full"
                  variant="outline"
                >
                  Adjust Temperature
                </Button>
                <Button 
                  onClick={() => handleCoolerCommand("force_defrost")}
                  className="w-full"
                  variant="outline"
                >
                  Force Defrost Cycle
                </Button>
                <Button 
                  onClick={() => handleCoolerCommand("diagnostic_test")}
                  className="w-full"
                  variant="outline"
                >
                  Run Diagnostics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Telemetry Chart */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>24-Hour Telemetry Data</CardTitle>
                <CardDescription>Temperature and humidity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentCooler.telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Temperature (°C)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        name="Humidity (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Recommendations */}
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentCooler.recommendations.map((recommendation, index) => (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        recommendation.includes("URGENT") 
                          ? "border-red-500/30 bg-red-500/10" 
                          : "border-border bg-muted/20"
                      }`}
                    >
                      {recommendation.includes("URGENT") && (
                        <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Compressor Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cycles Today</span>
                      <span className="font-semibold">{currentCooler.compressorCycles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Defrost</span>
                      <span className="font-semibold">{currentCooler.lastDefrost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(currentCooler.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Energy Efficiency</span>
                      <span className="font-semibold text-emerald-400">
                        {currentCooler.healthScore > 80 ? "Optimal" : 
                         currentCooler.healthScore > 60 ? "Good" : "Poor"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="font-semibold">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alerts</span>
                      <span className="font-semibold">
                        {currentCooler.status === "warning" ? "2 Active" : "None"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}