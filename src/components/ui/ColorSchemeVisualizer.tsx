
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ColorBlockProps {
  name: string;
  color: string;
  textColor?: string;
  className?: string;
}

const ColorBlock: React.FC<ColorBlockProps> = ({ name, color, textColor = 'text-white', className }) => (
  <div 
    className={cn(
      'flex h-16 items-end rounded-md p-2',
      textColor,
      className
    )}
    style={{ backgroundColor: `hsl(${color})` }}
  >
    <div className="flex w-full justify-between text-xs">
      <span>{name}</span>
      <span>{color}</span>
    </div>
  </div>
);

export function ColorSchemeVisualizer() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Color Scheme</CardTitle>
          <Button onClick={toggleTheme} variant="outline" size="sm">
            Toggle Theme
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="font-semibold">Base</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            <ColorBlock name="Background" color="var(--background)" textColor="text-foreground" />
            <ColorBlock name="Foreground" color="var(--foreground)" />
            <ColorBlock name="Card" color="var(--card)" textColor="text-card-foreground" />
            <ColorBlock name="Card Foreground" color="var(--card-foreground)" />
            <ColorBlock name="Popover" color="var(--popover)" textColor="text-popover-foreground" />
            <ColorBlock name="Popover Foreground" color="var(--popover-foreground)" />
          </div>
        </div>
        <Separator />
        <div className="grid gap-2">
          <div className="font-semibold">Semantic</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            <ColorBlock name="Primary" color="var(--primary)" textColor="text-primary-foreground" />
            <ColorBlock name="Primary Foreground" color="var(--primary-foreground)" />
            <ColorBlock name="Secondary" color="var(--secondary)" textColor="text-secondary-foreground" />
            <ColorBlock name="Secondary Foreground" color="var(--secondary-foreground)" />
            <ColorBlock name="Accent" color="var(--accent)" textColor="text-accent-foreground" />
            <ColorBlock name="Accent Foreground" color="var(--accent-foreground)" />
          </div>
        </div>
        <Separator />
        <div className="grid gap-2">
          <div className="font-semibold">States</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            <ColorBlock name="Destructive" color="var(--destructive)" textColor="text-destructive-foreground" />
            <ColorBlock name="Destructive Foreground" color="var(--destructive-foreground)" />
            <ColorBlock name="Muted" color="var(--muted)" textColor="text-muted-foreground" />
            <ColorBlock name="Muted Foreground" color="var(--muted-foreground)" />
            <ColorBlock name="Border" color="var(--border)" textColor={isDarkMode ? 'text-white' : 'text-black'} />
            <ColorBlock name="Input" color="var(--input)" textColor={isDarkMode ? 'text-white' : 'text-black'} />
            <ColorBlock name="Ring" color="var(--ring)" textColor={isDarkMode ? 'text-white' : 'text-black'} />
          </div>
        </div>
        <Separator />
        <div className="grid gap-2">
          <div className="font-semibold">Sidebar</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            <ColorBlock name="Sidebar" color="var(--sidebar-background)" textColor="text-sidebar-foreground" />
            <ColorBlock name="Sidebar Foreground" color="var(--sidebar-foreground)" />
            <ColorBlock name="Sidebar Primary" color="var(--sidebar-primary)" textColor="text-sidebar-primary-foreground" />
            <ColorBlock name="Sidebar Primary Foreground" color="var(--sidebar-primary-foreground)" />
            <ColorBlock name="Sidebar Accent" color="var(--sidebar-accent)" textColor="text-sidebar-accent-foreground" />
            <ColorBlock name="Sidebar Accent Foreground" color="var(--sidebar-accent-foreground)" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
