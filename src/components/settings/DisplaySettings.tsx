
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const DisplaySettings = () => {
  const [compactView, setCompactView] = useState(localStorage.getItem('compactView') === 'true');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [commandShortcutKey, setCommandShortcutKey] = useState(
    JSON.parse(localStorage.getItem('commandShortcut') || '{"key":"k","displayKey":"K"}').displayKey
  );
  const [isRecordingShortcut, setIsRecordingShortcut] = useState(false);

  useEffect(() => {
    localStorage.setItem('compactView', compactView.toString());
  }, [compactView]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    // This is simplified - actual dark mode implementation would use a theme provider
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleShortcutKeyDown = (e: React.KeyboardEvent) => {
    if (isRecordingShortcut) {
      e.preventDefault();
      
      // Only accept letters and numbers for shortcuts
      if (/^[a-z0-9]$/i.test(e.key)) {
        const newShortcut = {
          key: e.key.toLowerCase(),
          displayKey: e.key.toUpperCase()
        };
        
        localStorage.setItem('commandShortcut', JSON.stringify(newShortcut));
        setCommandShortcutKey(newShortcut.displayKey);
        setIsRecordingShortcut(false);
        
        toast.success("Tastaturgenvej opdateret", {
          description: `Command palette kan nu åbnes med Cmd/Ctrl + ${newShortcut.displayKey}`,
        });
      } else {
        toast.error("Ugyldig tast", {
          description: "Vælg venligst et bogstav eller et tal",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visningsindstillinger</CardTitle>
        <CardDescription>
          Tilpas hvordan applikationen vises og interagerer
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact-view" className="text-base">Kompakt visning</Label>
              <p className="text-sm text-muted-foreground">
                Reducer afstanden mellem elementer for at vise mere indhold
              </p>
            </div>
            <Switch
              id="compact-view"
              checked={compactView}
              onCheckedChange={setCompactView}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">Mørkt tema</Label>
              <p className="text-sm text-muted-foreground">
                Skift til mørkt farvetema for at reducere øjenbelastning
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tastaturgenveje</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="command-shortcut" className="text-base">Command Palette Genvej</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Tryk på Cmd/Ctrl + den valgte tast for at åbne command palette
            </p>
            
            <div className="flex items-center gap-2">
              <div className="flex-grow relative">
                <Input
                  id="command-shortcut"
                  value={isRecordingShortcut ? "Tryk på en tast..." : `Cmd/Ctrl + ${commandShortcutKey}`}
                  onKeyDown={handleShortcutKeyDown}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <Button 
                variant={isRecordingShortcut ? "destructive" : "outline"} 
                onClick={() => setIsRecordingShortcut(!isRecordingShortcut)}
              >
                {isRecordingShortcut ? "Annuller" : "Ændr"}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              Bemærk: Cmd + G virker også altid som en alternativ genvej
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
