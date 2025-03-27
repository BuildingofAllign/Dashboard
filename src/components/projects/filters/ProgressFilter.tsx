
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ProgressFilterProps {
  progressMin: number;
  progressMax: number;
  updateProgress: (min: number, max: number) => void;
}

export const ProgressFilter: React.FC<ProgressFilterProps> = ({
  progressMin,
  progressMax,
  updateProgress
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Fremgang</h4>
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateProgress(0, 25)}
          className={`h-8 ${
            progressMin === 0 && progressMax === 25 ? 'border-red-500' : ''
          }`}
        >
          0-25%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateProgress(26, 50)}
          className={`h-8 ${
            progressMin === 26 && progressMax === 50 ? 'border-yellow-500' : ''
          }`}
        >
          26-50%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateProgress(51, 75)}
          className={`h-8 ${
            progressMin === 51 && progressMax === 75 ? 'border-blue-500' : ''
          }`}
        >
          51-75%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateProgress(76, 100)}
          className={`h-8 ${
            progressMin === 76 && progressMax === 100 ? 'border-green-500' : ''
          }`}
        >
          76-100%
        </Button>
      </div>
      <div className="mt-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs">{progressMin}%</span>
          <span className="text-xs">{progressMax}%</span>
        </div>
        <Progress value={progressMax} className="h-2" />
      </div>
    </div>
  );
};
