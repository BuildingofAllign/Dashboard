
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortingFilterProps {
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  updateSortBy: (value: string) => void;
  updateSortDirection: (value: 'asc' | 'desc') => void;
}

export const SortingFilter: React.FC<SortingFilterProps> = ({
  sortBy,
  sortDirection,
  updateSortBy,
  updateSortDirection
}) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-1">Sorter efter</h4>
        <Select
          value={sortBy}
          onValueChange={updateSortBy}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Vælg sortering" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Navn</SelectItem>
            <SelectItem value="projectId">Projekt ID</SelectItem>
            <SelectItem value="progress">Fremgang</SelectItem>
            <SelectItem value="startDate">Startdato</SelectItem>
            <SelectItem value="endDate">Slutdato</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <h4 className="text-sm font-medium mb-1">Retning</h4>
        <Select
          value={sortDirection}
          onValueChange={(value) => updateSortDirection(value as 'asc' | 'desc')}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Vælg retning" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Stigende</SelectItem>
            <SelectItem value="desc">Faldende</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
