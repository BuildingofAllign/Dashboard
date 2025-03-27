
import React from 'react';
import { Button } from "@/components/ui/button";
import { ProjectStatus } from "../ProjectFilters";

interface StatusFilterProps {
  statuses: ProjectStatus[];
  toggleStatus: (status: ProjectStatus) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  statuses,
  toggleStatus
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Status</h4>
      <div className="flex gap-2">
        <Button
          variant={statuses.includes('igangværende') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleStatus('igangværende')}
          className="h-8"
        >
          Igangværende
        </Button>
        <Button
          variant={statuses.includes('planlagt') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleStatus('planlagt')}
          className="h-8"
        >
          Planlagt
        </Button>
        <Button
          variant={statuses.includes('afsluttet') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleStatus('afsluttet')}
          className="h-8"
        >
          Afsluttet
        </Button>
      </div>
    </div>
  );
};
