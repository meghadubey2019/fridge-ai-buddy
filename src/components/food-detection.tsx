import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Edit3, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DetectedItem {
  name: string;
  quantity: string;
  confidence: number;
  category: "meat" | "dairy" | "vegetables" | "fruits" | "beverages" | "other";
}

interface FoodDetectionProps {
  images: File[];
  onDetectionComplete: (items: DetectedItem[]) => void;
}

// Mock AI detection - replace with actual AI service
const mockDetectFood = async (images: File[]): Promise<DetectedItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time
  
  const mockItems: DetectedItem[] = [
    { name: "Milk", quantity: "1 bottle", confidence: 95, category: "dairy" },
    { name: "Apples", quantity: "6 pieces", confidence: 88, category: "fruits" },
    { name: "Chicken Breast", quantity: "2 pieces", confidence: 92, category: "meat" },
    { name: "Lettuce", quantity: "1 head", confidence: 85, category: "vegetables" },
    { name: "Orange Juice", quantity: "1 carton", confidence: 90, category: "beverages" },
    { name: "Yogurt", quantity: "4 cups", confidence: 87, category: "dairy" },
  ];
  
  return mockItems;
};

const getCategoryColor = (category: string) => {
  const colors = {
    meat: "bg-red-500/20 text-red-300 border-red-500/30",
    dairy: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    vegetables: "bg-green-500/20 text-green-300 border-green-500/30",
    fruits: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    beverages: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };
  return colors[category as keyof typeof colors] || colors.other;
};

export function FoodDetection({ images, onDetectionComplete }: FoodDetectionProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", category: "other" as DetectedItem["category"] });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      handleDetection();
    }
  }, [images]);

  const handleDetection = async () => {
    setIsDetecting(true);
    try {
      const items = await mockDetectFood(images);
      setDetectedItems(items);
      toast.success(`Detected ${items.length} items in your refrigerator`);
    } catch (error) {
      toast.error("Failed to detect food items");
    } finally {
      setIsDetecting(false);
    }
  };

  const updateItem = (index: number, updates: Partial<DetectedItem>) => {
    const updated = detectedItems.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
    setDetectedItems(updated);
    setEditingIndex(null);
  };

  const removeItem = (index: number) => {
    const updated = detectedItems.filter((_, i) => i !== index);
    setDetectedItems(updated);
  };

  const addNewItem = () => {
    if (newItem.name && newItem.quantity) {
      const item: DetectedItem = {
        ...newItem,
        confidence: 100, // Manual entry
      };
      setDetectedItems([...detectedItems, item]);
      setNewItem({ name: "", quantity: "", category: "other" });
      setShowAddForm(false);
      toast.success("Item added successfully");
    }
  };

  const handleContinue = () => {
    onDetectionComplete(detectedItems);
  };

  if (isDetecting) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary animate-pulse-glow" />
            <Loader2 className="w-6 h-6 text-primary animate-spin ml-2" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI Analysis in Progress</h3>
          <p className="text-muted-foreground">
            Our AI is analyzing your refrigerator images to detect food items and estimate quantities...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Detection Results</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Review the detected items and make any necessary adjustments. You can edit quantities or add missing items.
        </p>

        <div className="grid gap-4">
          {detectedItems.map((item, index) => (
            <Card key={index} className="p-4 bg-secondary/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Badge className={getCategoryColor(item.category)}>
                    {item.category}
                  </Badge>
                  {editingIndex === index ? (
                    <div className="flex gap-2 flex-1">
                      <Input
                        defaultValue={item.name}
                        placeholder="Item name"
                        className="flex-1"
                        onBlur={(e) => updateItem(index, { name: e.target.value })}
                      />
                      <Input
                        defaultValue={item.quantity}
                        placeholder="Quantity"
                        className="w-32"
                        onBlur={(e) => updateItem(index, { quantity: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-2">- {item.quantity}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {item.confidence}% confidence
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {showAddForm && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex gap-2">
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as DetectedItem["category"] })}
                  className="px-3 py-2 bg-background border border-border rounded-md"
                >
                  <option value="meat">Meat</option>
                  <option value="dairy">Dairy</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="beverages">Beverages</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-32"
                />
                <Button onClick={addNewItem} size="sm">
                  Add
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            className="w-full gap-2"
            disabled={showAddForm}
          >
            <Plus className="w-4 h-4" />
            Add Missing Item
          </Button>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {detectedItems.length} items detected
          </p>
          <Button onClick={handleContinue} className="gap-2">
            Continue to Recommendations
          </Button>
        </div>
      </Card>
    </div>
  );
}