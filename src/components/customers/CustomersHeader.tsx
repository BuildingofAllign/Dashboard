
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle';
import { PlusCircle, Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, CustomerRole } from '@/hooks/customers-types';

const customerRoles: CustomerRole[] = [
  "bygherre",
  "hovedentreprenør",
  "underentreprenør",
  "leverandør",
  "rådgiver",
  "andet",
];

interface CustomersHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
  filteredAndSortedCustomers: Customer[];
}

export const CustomersHeader: React.FC<CustomersHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  viewMode,
  setViewMode,
  setIsCreateDialogOpen,
  filteredAndSortedCustomers,
}) => {
  // Modified to directly pass the string value
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('');
  };

  const isFiltering = searchQuery || roleFilter;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6" />
            Kunder
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedCustomers.length} {filteredAndSortedCustomers.length === 1 ? 'kunde' : 'kunder'} 
            {isFiltering ? ' (filtreret)' : ''}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Opret kunde
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Søg efter kunder..."
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={roleFilter} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alle roller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alle roller</SelectItem>
              {customerRoles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFiltering && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Nulstil
            </Button>
          )}

          <ViewToggle currentView={viewMode} onChange={setViewMode} />
        </div>
      </div>
    </div>
  );
};
