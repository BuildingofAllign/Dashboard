
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DrawingCard, Drawing } from "@/components/drawings/DrawingCard";
import { AddDrawingCard } from "@/components/drawings/AddDrawingCard";
import { BreadcrumbNav } from "@/components/ui/BreadcrumbNav";
import { AnnotatableDrawingViewer } from "@/components/drawings/AnnotatableDrawingViewer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, Upload, 
  LayoutGrid, LayoutList, 
  Plus, X 
} from "lucide-react";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { NoData } from "@/components/ui/NoData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Placeholder data for drawings
const DRAWINGS_DATA: Drawing[] = [
  {
    id: "1",
    title: "Fundament plan",
    project: "Havneholmen Tower",
    version: "v2.1",
    uploadDate: "2023-10-15",
    uploadedBy: "Anders Jensen",
    thumbnail: "https://images.unsplash.com/photo-1616046638394-058923ed36a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJ1aWxkaW5nJTIwcGxhbnxlbnwwfHwwfHx8MA%3D%3D",
    tradeType: "Konstruktion",
    status: "Godkendt",
    hasAnnotations: false
  },
  {
    id: "2",
    title: "Elektrisk installation 1. sal",
    project: "Ørestad College",
    version: "v1.3",
    uploadDate: "2023-10-12",
    uploadedBy: "Mette Nielsen",
    thumbnail: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fGJ1aWxkaW5nJTIwcGxhbnxlbnwwfHwwfHx8MA%3D%3D",
    tradeType: "El",
    status: "Under revision",
    hasAnnotations: true
  },
  {
    id: "3",
    title: "Ventilation system",
    project: "Amager Strand Apartments",
    version: "v2.0",
    uploadDate: "2023-10-10",
    uploadedBy: "Lars Petersen",
    thumbnail: "https://images.unsplash.com/photo-1624507735324-127f183f48a7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ1fHxidWlsZGluZyUyMHBsYW58ZW58MHx8MHx8fDA%3D",
    tradeType: "VVS",
    status: "Godkendt",
    hasAnnotations: false
  },
  {
    id: "4",
    title: "Facade elevation",
    project: "Havneholmen Tower",
    version: "v1.1",
    uploadDate: "2023-10-05",
    uploadedBy: "Sofie Hansen",
    thumbnail: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzIwfHxidWlsZGluZyUyMHBsYW58ZW58MHx8MHx8fDA%3D",
    tradeType: "Arkitektur",
    status: "Under revision",
    hasAnnotations: true
  },
  {
    id: "5",
    title: "Kælderplan",
    project: "Ørestad College",
    version: "v1.0",
    uploadDate: "2023-09-28",
    uploadedBy: "Anders Jensen",
    thumbnail: "https://images.unsplash.com/photo-1574691530338-27faaade82a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzYxfHxidWlsZGluZyUyMHBsYW58ZW58MHx8MHx8fDA%3D",
    tradeType: "Konstruktion",
    status: "Under udarbejdelse",
    hasAnnotations: false
  },
  {
    id: "6",
    title: "Tagkonstruktion",
    project: "Amager Strand Apartments",
    version: "v1.2",
    uploadDate: "2023-09-22",
    uploadedBy: "Peter Madsen",
    thumbnail: "https://images.unsplash.com/photo-1617469165786-8007eda3caa7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDUzfHxidWlsZGluZyUyMHBsYW58ZW58MHx8MHx8fDA%3D",
    tradeType: "Konstruktion",
    status: "Afvist",
    hasAnnotations: true
  }
];

const Tegninger = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [isDrawingViewerOpen, setIsDrawingViewerOpen] = useState(false);
  const [filteredDrawings, setFilteredDrawings] = useState<Drawing[]>([]);

  // Fetch drawings
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter drawings based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDrawings(DRAWINGS_DATA);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = DRAWINGS_DATA.filter(drawing => 
      drawing.title.toLowerCase().includes(lowerCaseQuery) ||
      drawing.project.toLowerCase().includes(lowerCaseQuery) ||
      drawing.tradeType.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredDrawings(filtered);
  }, [searchQuery]);

  const handleViewDrawing = (drawing: Drawing) => {
    setSelectedDrawing(drawing);
    setIsDrawingViewerOpen(true);
  };

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Tegninger" }
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Tegninger" userInitials="BL" />
      
      <div className="flex-1 overflow-auto p-6">
        <BreadcrumbNav items={breadcrumbItems} />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 mb-6">
          <h1 className="text-2xl font-semibold">Tegninger</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Søg tegninger..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Button variant="outline" className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              gridIcon={<LayoutGrid className="h-4 w-4" />}
              listIcon={<LayoutList className="h-4 w-4" />}
            />
            
            <Button className="flex gap-2 items-center">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredDrawings.length === 0 ? (
          <NoData
            title="Ingen tegninger fundet"
            description="Prøv at søge med andre søgeord eller tilføj en ny tegning"
            icon={<FileText className="h-12 w-12 text-muted-foreground/60" />}
            action={
              <Button className="flex gap-2 items-center">
                <Plus className="h-4 w-4" />
                <span>Upload tegning</span>
              </Button>
            }
          />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}>
            {viewMode === "grid" && (
              <AddDrawingCard />
            )}
            
            {filteredDrawings.map((drawing) => (
              <DrawingCard
                key={drawing.id}
                drawing={drawing}
                onView={() => handleViewDrawing(drawing)}
              />
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDrawingViewerOpen} onOpenChange={setIsDrawingViewerOpen}>
        <DialogContent className="max-w-6xl w-[90vw] h-[80vh] p-0">
          {selectedDrawing && (
            <AnnotatableDrawingViewer 
              drawing={selectedDrawing}
              onClose={() => setIsDrawingViewerOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tegninger;
