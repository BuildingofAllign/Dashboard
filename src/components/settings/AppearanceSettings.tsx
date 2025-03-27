
import React from "react";

export const AppearanceSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Appearance</h2>
        <p className="text-muted-foreground text-sm">
          Customize how the app looks and feels.
        </p>
      </div>
      
      <div className="p-8 text-center border rounded-md bg-card">
        <p className="text-muted-foreground">
          Appearance settings will be available soon.
        </p>
      </div>
    </div>
  );
};
