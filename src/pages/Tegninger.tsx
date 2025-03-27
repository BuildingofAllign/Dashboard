
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DrawingCard } from "@/components/drawings/DrawingCard";
import { AddDrawingCard } from "@/components/drawings/AddDrawingCard";
import { useData } from "@/context/DataContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Tegninger: React.FC = () => {
  const { drawings, loadingDrawings, fetchDrawings, projects } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  const filteredDrawings = drawings.filter(drawing => {
    // Search filter
    const matchesSearch = drawing.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = projectFilter === "all" || 
      drawing.project_id === projectFilter;
    
    // Drawing type filter - assuming drawing titles contain type information
    const matchesType = typeFilter === "all" || 
      drawing.title?.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesProject && matchesType;
  });

  // Get unique projects for filter dropdown
  const uniqueProjects = [...new Set(projects.map(p => ({ id: p.id, name: p.name })))];

  // Common drawing types for filter dropdown
  const drawingTypes = ["Plantegning", "Snittegning", "Detailtegning", "El", "VVS"];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tegninger" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar 
              placeholder="Søg efter tegning..." 
              onChange={setSearchQuery}
              value={searchQuery}
            />
            <div className="flex gap-2 mt-4 md:mt-0">
              <FilterSelect 
                value={projectFilter} 
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="all">Alle projekter</option>
                {uniqueProjects.map((project) => (
                  <option key={project.id} value={project.id}>Projekt {project.name}</option>
                ))}
              </FilterSelect>
              <FilterSelect 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Alle typer</option>
                {drawingTypes.map((type, index) => (
                  <option key={index} value={type.toLowerCase()}>{type}</option>
                ))}
              </FilterSelect>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-5 w-5 mr-1" />
                Upload tegning
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          {loadingDrawings ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredDrawings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrawings.map((drawing) => (
                <DrawingCard 
                  key={drawing.id}
                  title={drawing.title}
                  project={projects.find(p => p.id === drawing.project_id)?.name || "Ukendt projekt"}
                  version={drawing.version}
                  imageSrc={drawing.image_url}
                  deviations={drawing.deviations || 0}
                  additionalTasks={drawing.additional_tasks || 0}
                  updatedDaysAgo={drawing.updated_days_ago || 0}
                  annotationMarkers={drawing.drawing_annotation_markers?.map(marker => ({
                    id: marker.id,
                    position: marker.position,
                    color: marker.color
                  })) || []}
                />
              ))}
              <AddDrawingCard />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Ingen tegninger fundet med de valgte filtre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tegninger;
