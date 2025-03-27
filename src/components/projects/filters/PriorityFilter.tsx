
import React from 'react';
import { Button } from "@/components/ui/button";
import { ProjectPriority } from "../ProjectFilters";

interface PriorityFilterProps {
  priorities: ProjectPriority[];
  togglePriority: (priority: ProjectPriority) => void;
}

export const PriorityFilter: React.FC<PriorityFilterProps> = ({
  priorities,
  togglePriority
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Prioritet</h4>
      <div className="flex gap-2">
        <Button
          variant={priorities.includes('high') ? "default" : "outline"}
          size="sm"
          onClick={() => togglePriority('high')}
          className="h-8 bg-red-600 text-white hover:bg-red-700"
        >
          Høj
        </Button>
        <Button
          variant={priorities.includes('medium') ? "default" : "outline"}
          size="sm"
          onClick={() => togglePriority('medium')}
          className="h-8 bg-yellow-500 text-white hover:bg-yellow-600"
        >
          Medium
        </Button>
        <Button
          variant={priorities.includes('low') ? "default" : "outline"}
          size="sm"
          onClick={() => togglePriority('low')}
          className="h-8 bg-green-600 text-white hover:bg-green-700"
        >
          Lav
        </Button>
        <Button
          variant={priorities.includes('none') ? "default" : "outline"}
          size="sm"
          onClick={() => togglePriority('none')}
          className="h-8"
        >
          Ingen
        </Button>
      </div>
    </div>
  );
};
