import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { useDeviations } from "@/hooks/use-deviations";
import { Button } from "@/components/ui/button";
import { DeviationForm } from "@/components/deviations/DeviationForm";
import { PlusCircle, Filter, Search, ChevronRight } from "lucide-react";
import { DeviationCard } from "@/components/deviations/DeviationCard";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/ui/SearchBar";
import { BulkActionsBar, BulkAction } from "@/components/ui/BulkActionsBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardLayout } from "../App";

// Add a more diverse set of deviations for demonstration purposes
const DEMO_DEVIATIONS = [
  {
    id: "dev-1",
    title: "Manglende el-installation i køkken",
    description: "Der mangler installation af stikkontakt i køkken ved køleskab. Kunden har påpeget problemet, og det skal løses snarest.",
    status: "Åben",
    date: "10. juli 2023",
    location: "Køkken, 2. sal",
    project_name: "Havneholmen Tower",
    assignee: "Lars Jensen",
    hasPhotos: true,
    hasComments: 2,
    hasDocuments: true
  },
  {
    id: "dev-2",
    title: "Revne i betonvæg i kælder",
    description: "Der er opdaget en større revne i betonvæggen i kælderrum K12. Skal undersøges for strukturelle problemer.",
    status: "Afventer",
    date: "3. august 2023",
    location: "Kælderrum K12",
    project_name: "Amager Strand Apartments",
    assignee: "Peter Madsen",
    hasPhotos: true,
    hasComments: 0,
    hasDocuments: false
  },
  {
    id: "dev-3",
    title: "Forkert vinduesstørrelse i facade",
    description: "Vinduerne leveret til sydvendt facade matcher ikke specifikationerne i tegningerne. Alle vinduer skal udskiftes.",
    status: "Godkendt",
    date: "15. juni 2023",
    location: "Sydfacade",
    project_name: "Ørestad College",
    assignee: "Mette Nielsen",
    hasPhotos: true,
    hasComments: 4,
    hasDocuments: true
  },
  {
    id: "dev-4",
    title: "Manglende isolering over loft",
    description: "Ved inspektion blev det konstateret, at der mangler isolering på et område på cirka 25m² over loftet i bygning B.",
    status: "Afvist",
    date: "7. juli 2023",
    location: "Bygning B, loftrum",
    project_name: "Nordhavn Office Complex",
    assignee: "Sofie Hansen",
    hasPhotos: false,
    hasComments: 1,
    hasDocuments: true
  }
];

const Afvigelser = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeviations, setSelectedDeviations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { 
    loadingDeviations, 
    deviations: apiDeviations, 
    refreshDeviations 
  } = useDeviations();
  
  // In a real app, we would use the data from useDeviations()
  // For demonstration, we're using the DEMO_DEVIATIONS constant
  const deviations = DEMO_DEVIATIONS;
  
  // Fetch deviations on component mount
  useEffect(() => {
    refreshDeviations();
  }, [refreshDeviations]);
  
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };
  
  const filteredDeviations = deviations.filter(dev => {
    // Filter by search query
    const matchesSearch = dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dev.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = activeTab === "all" || 
                      (activeTab === "open" && (dev.status === "Åben" || dev.status === "Afventer")) ||
                      (activeTab === "approved" && dev.status === "Godkendt") ||
                      (activeTab === "rejected" && dev.status === "Afvist");
    
    return matchesSearch && matchesTab;
  });
  
  const handleSelectDeviation = (id: string) => {
    setSelectedDeviations(prev => 
      prev.includes(id) ? prev.filter(devId => devId !== id) : [...prev, id]
    );
  };
  
  const handleViewDeviation = (id: string) => {
    toast.info(`Viser detaljer for afvigelse ${id}`);
  };
  
  const handleApproveDeviation = (id: string) => {
    toast.success(`Afvigelse ${id} godkendt`);
  };
  
  const handleRejectDeviation = (id: string) => {
    toast.error(`Afvigelse ${id} afvist`);
  };
  
  const handleClearSelection = () => {
    setSelectedDeviations([]);
  };
  
  // Define bulk actions
  const primaryBulkActions: BulkAction[] = [
    {
      id: "approve",
      label: "Godkend",
      icon: <ChevronRight className="h-4 w-4 mr-1" />,
      action: () => {
        toast.success(`${selectedDeviations.length} afvigelser godkendt`);
        setSelectedDeviations([]);
      }
    }
  ];
  
  const secondaryBulkActions: BulkAction[] = [
    {
      id: "reject",
      label: "Afvis",
      action: () => {
        toast.error(`${selectedDeviations.length} afvigelser afvist`);
        setSelectedDeviations([]);
      },
      variant: "destructive"
    },
    {
      id: "assign",
      label: "Tildel ansvarlig",
      action: () => {
        toast.info(`Tildeler ansvarlig for ${selectedDeviations.length} afvigelser`);
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <Header title="Afvigelser" userInitials="BL" />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Registrerede afvigelser</h2>
              <p className="text-muted-foreground">
                Spor og håndter afvigelser på tværs af dine projekter
              </p>
            </div>
            
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ny afvigelse
            </Button>
          </div>
          
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                placeholder="Søg i afvigelser..."
                onChange={handleSearch}
                value={searchQuery}
                onClear={() => setSearchQuery("")}
                className="w-full sm:w-80"
              />
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Alle afvigelser</TabsTrigger>
                <TabsTrigger value="open">Åbne</TabsTrigger>
                <TabsTrigger value="approved">Godkendte</TabsTrigger>
                <TabsTrigger value="rejected">Afviste</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loadingDeviations ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredDeviations.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredDeviations.map((deviation) => (
                <div 
                  key={deviation.id} 
                  className={`${selectedDeviations.includes(deviation.id) ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleSelectDeviation(deviation.id)}
                >
                  <DeviationCard 
                    deviation={deviation}
                    onView={handleViewDeviation}
                    onApprove={handleApproveDeviation}
                    onReject={handleRejectDeviation}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ingen afvigelser matcher dine søgekriterier.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Nulstil filtre
              </Button>
            </div>
          )}
        </div>

        <BulkActionsBar
          selectedCount={selectedDeviations.length}
          primaryActions={primaryBulkActions}
          secondaryActions={secondaryBulkActions}
          onClearSelection={handleClearSelection}
          className="z-50"
        />

        <DeviationForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      </div>
    </DashboardLayout>
  );
};

export default Afvigelser;
