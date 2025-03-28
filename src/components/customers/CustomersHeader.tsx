
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle';
import { PlusCircle, Building, X, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, CustomerRole } from '@/hooks/customers-types';
import { Badge } from '@/components/ui/badge';

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
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    roleFilter ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            Kunder
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedCustomers.length} {filteredAndSortedCustomers.length === 1 ? 'kunde' : 'kunder'} 
            {isFiltering ? ' (filtreret)' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="transition-all hover:bg-primary/90"
          size="sm"
        >
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
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={roleFilter} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px] bg-background border-input">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Alle roller" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Alle roller</SelectItem>
              {customerRoles.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeFilterCount > 0 && (
            <Badge variant="outline" className="gap-1 py-1.5">
              {activeFilterCount} aktiv{activeFilterCount > 1 ? 'e' : ''} filter{activeFilterCount > 1 ? 's' : ''}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 rounded-full p-0" 
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <ViewToggle currentView={viewMode} onChange={setViewMode} />
        </div>
      </div>
    </div>
  );
};
