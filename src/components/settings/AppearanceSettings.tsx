
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/hooks/use-theme";
import { ColorSchemeVisualizer } from "@/components/ui/ColorSchemeVisualizer";
import { Monitor, Moon, Sun, Palette, Layout, Type } from "lucide-react";

export const AppearanceSettings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("theme");
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compactView') === 'true');
  const [fontSizePreference, setFontSizePreference] = useState(localStorage.getItem('fontSize') || 'medium');
  const [reduceMotion, setReduceMotion] = useState(localStorage.getItem('reduceMotion') === 'true');

  const handleFontSizeChange = (value: string) => {
    setFontSizePreference(value);
    localStorage.setItem('fontSize', value);
    // Actual implementation would apply font size changes
  };

  const handleCompactModeChange = (value: boolean) => {
    setCompactMode(value);
    localStorage.setItem('compactView', value.toString());
    // Actual implementation would apply spacing changes
  };

  const handleReduceMotionChange = (value: boolean) => {
    setReduceMotion(value);
    localStorage.setItem('reduceMotion', value.toString());
    // Actual implementation would adjust animations
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Udseende</h2>
        <p className="text-muted-foreground text-sm">
          Tilpas hvordan applikationen ser ud og føles.
        </p>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Tema</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Layout</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Typografi</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema Indstillinger</CardTitle>
              <CardDescription>
                Vælg mellem lyst og mørkt tema, eller lad systemindstillingerne bestemme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup 
                defaultValue={isDarkMode ? "dark" : "light"}
                onValueChange={(value) => {
                  if ((value === "dark" && !isDarkMode) || (value === "light" && isDarkMode)) {
                    toggleTheme();
                  }
                }}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="light" 
                    id="theme-light" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="theme-light" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Lyst</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="dark" 
                    id="theme-dark" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="theme-dark" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">Mørkt</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="system" 
                    id="theme-system" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="theme-system" 
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Monitor className="mb-3 h-6 w-6" />
                    <span className="text-sm font-medium">System</span>
                  </Label>
                </div>
              </RadioGroup>
              
              <Separator />
              <ColorSchemeVisualizer />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Indstillinger</CardTitle>
              <CardDescription>
                Tilpas layoutet til dine præferencer med disse indstillinger.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Kompakt Visning</Label>
                  <p className="text-sm text-muted-foreground">
                    Reducerer mellemrum mellem elementer for at vise mere indhold.
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduce-motion">Reducer Animation</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimerer bevægelser og animationer i brugergrænsefladen.
                  </p>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={handleReduceMotionChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typografi Indstillinger</CardTitle>
              <CardDescription>
                Vælg skriftstørrelse og andre tekstindstillinger.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Skriftstørrelse</Label>
                <RadioGroup 
                  defaultValue={fontSizePreference}
                  onValueChange={handleFontSizeChange}
                  className="grid grid-cols-3 gap-2"
                >
                  <div>
                    <RadioGroupItem 
                      value="small" 
                      id="font-small" 
                      className="sr-only" 
                    />
                    <Label 
                      htmlFor="font-small" 
                      className="flex flex-col items-center rounded-md border-2 border-muted px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm"
                    >
                      <span className="text-xs">Aa</span>
                      <span className="mt-1 text-xs">Lille</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="medium" 
                      id="font-medium" 
                      className="sr-only" 
                    />
                    <Label 
                      htmlFor="font-medium" 
                      className="flex flex-col items-center rounded-md border-2 border-muted px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-sm">Aa</span>
                      <span className="mt-1 text-xs">Medium</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="large" 
                      id="font-large" 
                      className="sr-only" 
                    />
                    <Label 
                      htmlFor="font-large" 
                      className="flex flex-col items-center rounded-md border-2 border-muted px-3 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-base">Aa</span>
                      <span className="mt-1 text-xs">Stor</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Prøvetekst</h3>
                <div className="rounded-md border p-4">
                  <p className={`${
                    fontSizePreference === "small" ? "text-sm" : 
                    fontSizePreference === "large" ? "text-lg" : "text-base"
                  }`}>
                    Dette er en eksempeltekst, der viser hvordan teksten vil se ud med den valgte skriftstørrelse. 
                    Vi bruger dette eksempel til at demonstrere, hvordan forskellige skriftstørrelser kan påvirke læsbarheden.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">Nulstil til standard</Button>
        <Button>Gem indstillinger</Button>
      </div>
    </div>
  );
};
