
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Building, Building2, ConstructionIcon, Factory } from "lucide-react";
import { ProjectCategory } from "../ProjectFilters";

interface FilterCategoryProps {
  categories: ProjectCategory[];
  toggleCategory: (category: ProjectCategory) => void;
}

export const FilterCategory: React.FC<FilterCategoryProps> = ({
  categories,
  toggleCategory
}) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2">Kategori</h4>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={categories.includes('bolig') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory('bolig')}
          className="h-8"
        >
          <Home className="h-3 w-3 mr-1" />
          Bolig
        </Button>
        <Button
          variant={categories.includes('erhverv') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory('erhverv')}
          className="h-8"
        >
          <Building className="h-3 w-3 mr-1" />
          Erhverv
        </Button>
        <Button
          variant={categories.includes('institution') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory('institution')}
          className="h-8"
        >
          <Building2 className="h-3 w-3 mr-1" />
          Institution
        </Button>
        <Button
          variant={categories.includes('renovering') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory('renovering')}
          className="h-8"
        >
          <ConstructionIcon className="h-3 w-3 mr-1" />
          Renovering
        </Button>
        <Button
          variant={categories.includes('andet') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory('andet')}
          className="h-8"
        >
          <Factory className="h-3 w-3 mr-1" />
          Andet
        </Button>
      </div>
    </div>
  );
};
