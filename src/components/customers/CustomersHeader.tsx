
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle';
import { Filter, PlusCircle, Building, X, SlidersHorizontal, CalendarDays, Map } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer, CustomerRole } from '@/hooks/customers-types';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hasContact, setHasContact] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");

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
    setHasContact(false);
    setRecentlyAdded(false);
    setLocationFilter("");
  };

  const isFiltering = searchQuery || roleFilter || hasContact || recentlyAdded || locationFilter;
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    roleFilter ? 1 : 0,
    hasContact ? 1 : 0,
    recentlyAdded ? 1 : 0,
    locationFilter ? 1 : 0
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
              <SelectItem value="all">Alle roller</SelectItem>
              {customerRoles.map((role) => (
                <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Avanceret filter</span>
                <span className="inline sm:hidden">Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Avancerede filtre</h4>
                  <p className="text-sm text-muted-foreground">
                    Tilpas din søgning med avancerede filtre
                  </p>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="has-contact"
                      checked={hasContact}
                      onCheckedChange={(checked) => setHasContact(!!checked)}
                    />
                    <Label htmlFor="has-contact">Har kontaktperson</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="recently-added"
                      checked={recentlyAdded}
                      onCheckedChange={(checked) => setRecentlyAdded(!!checked)}
                    />
                    <Label htmlFor="recently-added">Tilføjet inden for 30 dage</Label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Lokation</Label>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="Indtast by eller område" 
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => setShowAdvancedFilters(false)}>Anvend filtre</Button>
              </div>
            </PopoverContent>
          </Popover>

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
