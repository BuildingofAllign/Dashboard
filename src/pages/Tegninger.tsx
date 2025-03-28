
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AddDrawingCard } from "@/components/drawings/AddDrawingCard";
import { DrawingCard, Drawing } from "@/components/drawings/DrawingCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AnnotatableDrawingViewer } from "@/components/drawings/AnnotatableDrawingViewer";
import { PlusCircle, Filter, Layers, History, Clock } from "lucide-react";
import { toast } from "sonner";

// Mock data for drawings
const DEMO_DRAWINGS: Drawing[] = [
  {
    id: "draw-1",
    title: "Grundplan 1. sal, Building A",
    project: "Havneholmen Tower",
    version: "v2.3",
    uploadDate: "3. juni 2023",
    uploadedBy: "Anders Jensen",
    thumbnail: "https://placehold.co/400x300/e6e6e6/939393?text=Floor+Plan",
    tradeType: "Arkitekt",
    status: "Aktuel",
    hasAnnotations: true
  },
  {
    id: "draw-2",
    title: "Elektriske installationer, Bygning B",
    project: "Ørestad College",
    version: "v1.0",
    uploadDate: "15. juli 2023",
    uploadedBy: "Mette Nielsen",
    thumbnail: "https://placehold.co/400x300/e6e6e6/939393?text=Electrical",
    tradeType: "El",
    status: "Review",
    hasAnnotations: false
  },
  {
    id: "draw-3",
    title: "VVS, Køkken detaljer",
    project: "Amager Strand Apartments",
    version: "v3.1",
    uploadDate: "27. maj 2023",
    uploadedBy: "Lars Petersen",
    thumbnail: "https://placehold.co/400x300/e6e6e6/939393?text=Plumbing",
    tradeType: "VVS",
    status: "Aktuel",
    hasAnnotations: true
  },
  {
    id: "draw-4",
    title: "Facade syd, detaljering",
    project: "Nordhavn Office Complex",
    version: "v1.2",
    uploadDate: "10. august 2023",
    uploadedBy: "Sofie Hansen",
    thumbnail: "https://placehold.co/400x300/e6e6e6/939393?text=Facade",
    tradeType: "Arkitekt",
    status: "Forældet",
    hasAnnotations: false
  }
];

const Tegninger: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };
  
  const filteredDrawings = DEMO_DRAWINGS.filter(drawing => {
    // Filter by search query
    const matchesSearch = drawing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drawing.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         drawing.tradeType.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = activeTab === "all" || 
                      (activeTab === "architectural" && drawing.tradeType === "Arkitekt") ||
                      (activeTab === "electrical" && drawing.tradeType === "El") ||
                      (activeTab === "plumbing" && drawing.tradeType === "VVS");
    
    return matchesSearch && matchesTab;
  });
  
  const handleOpenDrawing = (drawing: Drawing) => {
    setSelectedDrawing(drawing);
  };
  
  const handleSaveAnnotations = (annotations: any) => {
    toast.success("Annotationer gemt", {
      description: `${annotations.length} annotationer gemt til tegning.`
    });
  };

  return (
    <>
      <Header title="Tegninger" userInitials="BL" />
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Tegninger</h2>
            <p className="text-muted-foreground">
              Håndter og visualiser projekttegninger
            </p>
          </div>
          
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload ny tegning
          </Button>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar
              placeholder="Søg i tegninger..."
              onChange={handleSearch}
              value={searchQuery}
              onClear={() => setSearchQuery("")}
              className="w-full sm:w-80"
            />
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Alle tegninger</TabsTrigger>
              <TabsTrigger value="architectural">Arkitekt</TabsTrigger>
              <TabsTrigger value="electrical">El</TabsTrigger>
              <TabsTrigger value="plumbing">VVS</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDrawings.map(drawing => (
            <DrawingCard 
              key={drawing.id}
              drawing={drawing}
              onView={() => handleOpenDrawing(drawing)}
            />
          ))}
          
          <AddDrawingCard />
        </div>
      </div>
      
      <Dialog 
        open={!!selectedDrawing} 
        onOpenChange={(open) => !open && setSelectedDrawing(null)}
      >
        <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{selectedDrawing?.title}</DialogTitle>
                <DialogDescription>
                  {selectedDrawing?.project} - {selectedDrawing?.version}
                </DialogDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">Versioner</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Historik</span>
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Tidslinje</span>
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <AnnotatableDrawingViewer 
              imageUrl={selectedDrawing?.thumbnail || ""}
              onSave={handleSaveAnnotations}
              className="h-full"
            />
          </div>
          
          <DialogFooter>
            <div className="w-full flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Uploadet {selectedDrawing?.uploadDate} af {selectedDrawing?.uploadedBy}
              </div>
              <Button onClick={() => setSelectedDrawing(null)}>Luk</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tegninger;
