
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  AlertCircle, 
  Clock, 
  FileText, 
  Image, 
  MapPin, 
  Plus, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Camera,
  UserCheck,
  FileCheck,
  Download,
  History,
  Filter
} from "lucide-react";

// Dummy data for quality assurance (KS) items
const qualityAssuranceItems = [
  {
    id: "KS-001",
    title: "Stikkontakt installation i køkken",
    project: "Projekt Havnegade 8",
    drawing: "El-tegning E03",
    created: "2 dage siden",
    status: "Afventer godkendelse",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4"
    ],
    description: "Installation af stikkontakter i køkken ifølge godkendt afvigelse AFV-002. Placeret 15 cm til venstre for oprindelig placering pga. vandrørs placering.",
    performedBy: "Boktogan Saruhan",
    trade: "Elektriker",
    relatedItem: { type: "Afvigelse", id: "AFV-002" },
    location: { x: 345, y: 156 },
    date: "2023-04-15",
    checklist: [
      { item: "Korrekt placering", checked: true },
      { item: "Korrekt materiale", checked: true },
      { item: "Funktionstest gennemført", checked: true },
      { item: "Visuel inspektion", checked: true }
    ],
    history: [
      { action: "Oprettet", by: "BS", time: "2 dage siden" },
      { action: "Billeder tilføjet", by: "BS", time: "2 dage siden" },
      { action: "Sendt til godkendelse", by: "BS", time: "1 dag siden" }
    ]
  },
  {
    id: "KS-002",
    title: "Forstærkning af tagkonstruktion",
    project: "Projekt Stationsvej 23",
    drawing: "Tagplan T02",
    created: "1 dag siden",
    status: "Godkendt",
    images: [
      "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"
    ],
    description: "Ekstra forstærkning af tagkonstruktion efter tillægsopgave AT-002. 8 spærforstærkninger og 32 beslag monteret med korrekt afstand og placering.",
    performedBy: "Jens Paulsen",
    trade: "Tømrer",
    relatedItem: { type: "Tillægsopgave", id: "AT-002" },
    location: { x: 278, y: 412 },
    date: "2023-04-16",
    checklist: [
      { item: "Korrekt placering", checked: true },
      { item: "Korrekt materiale", checked: true },
      { item: "Monteret efter specifikation", checked: true },
      { item: "Lasttest gennemført", checked: true }
    ],
    history: [
      { action: "Oprettet", by: "JP", time: "1 dag siden" },
      { action: "Billeder tilføjet", by: "JP", time: "1 dag siden" },
      { action: "Godkendt af byggeleder", by: "BL", time: "6 timer siden" }
    ]
  },
  {
    id: "KS-003",
    title: "Isolering af vandrør i badeværelse",
    project: "Projekt Skovvej 12",
    drawing: "VVS-tegning V05",
    created: "3 dage siden",
    status: "Rettelser påkrævet",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a"
    ],
    description: "Isolering af vandrør i badeværelse. Supplerende isolering påkrævet ved gennemføringer i væg.",
    performedBy: "Mette Nielsen",
    trade: "VVS",
    relatedItem: null,
    location: { x: 189, y: 276 },
    date: "2023-04-14",
    checklist: [
      { item: "Korrekt isoleringsmateriale", checked: true },
      { item: "Komplet isolering", checked: false },
      { item: "Tæthedsprøve udført", checked: true },
      { item: "Visuel inspektion", checked: true }
    ],
    history: [
      { action: "Oprettet", by: "MN", time: "3 dage siden" },
      { action: "Billeder tilføjet", by: "MN", time: "3 dage siden" },
      { action: "Rettelser påkrævet", by: "BL", time: "2 dage siden" },
      { action: "Kommentar tilføjet", by: "BL", time: "2 dage siden" }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Afventer godkendelse":
      return "bg-yellow-100 text-yellow-800";
    case "Godkendt":
      return "bg-green-100 text-green-800";
    case "Rettelser påkrævet":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Afventer godkendelse":
      return <Clock className="h-4 w-4 mr-1.5" />;
    case "Godkendt":
      return <CheckCircle className="h-4 w-4 mr-1.5" />;
    case "Rettelser påkrævet":
      return <XCircle className="h-4 w-4 mr-1.5" />;
    default:
      return <AlertCircle className="h-4 w-4 mr-1.5" />;
  }
};

const getRelatedItemBadge = (item: { type: string; id: string } | null) => {
  if (!item) return null;
  
  const bgColor = item.type === "Afvigelse" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800";
  
  return (
    <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center ${bgColor}`}>
      <AlertCircle className="h-3 w-3 mr-1" />
      {item.type} {item.id}
    </span>
  );
};

const Kvalitetssikring: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tradeFilter, setTradeFilter] = useState("all");
  const [relatedItemFilter, setRelatedItemFilter] = useState("all");
  const [showHistory, setShowHistory] = useState<string | null>(null);

  const filteredItems = qualityAssuranceItems.filter((item) => {
    // Search filter
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = projectFilter === "all" || item.project === projectFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    // Trade filter
    const matchesTrade = tradeFilter === "all" || item.trade === tradeFilter;
    
    // Related item filter
    const matchesRelatedItem = relatedItemFilter === "all" || 
      (relatedItemFilter === "afvigelse" && item.relatedItem?.type === "Afvigelse") ||
      (relatedItemFilter === "tillægsopgave" && item.relatedItem?.type === "Tillægsopgave") ||
      (relatedItemFilter === "ingen" && !item.relatedItem);
    
    return matchesSearch && matchesProject && matchesStatus && matchesTrade && matchesRelatedItem;
  });

  const handleCreateQA = () => {
    toast.success("Nyt kvalitetssikringspunkt oprettet!", {
      description: "Du kan nu tilføje billeder og detaljer."
    });
  };

  const handleApproveQA = (id: string) => {
    toast.success(`KS punkt ${id} godkendt`, {
      description: "Punktet er nu markeret som godkendt og kan inkluderes i slutdokumentation."
    });
  };

  const handleRequestChanges = (id: string) => {
    toast.warning(`Rettelser påkrævet for KS punkt ${id}`, {
      description: "En beskrivelse af de nødvendige rettelser er tilføjet."
    });
  };

  const handleExportPDF = () => {
    toast.success("Eksporterer kvalitetssikringsdokumentation", {
      description: "PDF-dokumentet vil være klar til download om et øjeblik."
    });
  };

  const handleToggleHistory = (id: string) => {
    setShowHistory(showHistory === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Kvalitetssikring" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar 
                placeholder="Søg i kvalitetssikring..." 
                onChange={setSearchQuery}
              />
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => toast.info("Filtre anvendt", { description: "Visningen er opdateret med dine filtreringer." })}
              >
                <Filter className="h-5 w-5 mr-1" />
                Avanceret filter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={handleExportPDF}
              >
                <Download className="h-5 w-5 mr-1" />
                Eksportér PDF
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateQA}>
                <Plus className="h-5 w-5 mr-1" />
                Nyt KS-punkt
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <FilterSelect onChange={(e) => setProjectFilter(e.target.value)}>
              <option value="all">Alle projekter</option>
              <option value="Projekt Skovvej 12">Projekt Skovvej 12</option>
              <option value="Projekt Havnegade 8">Projekt Havnegade 8</option>
              <option value="Projekt Stationsvej 23">Projekt Stationsvej 23</option>
            </FilterSelect>
            <FilterSelect onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Alle statuser</option>
              <option value="Afventer godkendelse">Afventer godkendelse</option>
              <option value="Godkendt">Godkendt</option>
              <option value="Rettelser påkrævet">Rettelser påkrævet</option>
            </FilterSelect>
            <FilterSelect onChange={(e) => setTradeFilter(e.target.value)}>
              <option value="all">Alle fag</option>
              <option value="Tømrer">Tømrer</option>
              <option value="Elektriker">Elektriker</option>
              <option value="VVS">VVS</option>
              <option value="Maler">Maler</option>
            </FilterSelect>
            <FilterSelect onChange={(e) => setRelatedItemFilter(e.target.value)}>
              <option value="all">Alle relationer</option>
              <option value="afvigelse">Fra afvigelse</option>
              <option value="tillægsopgave">Fra tillægsopgave</option>
              <option value="ingen">Ingen relation</option>
            </FilterSelect>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item.id}
                          </span>
                          {getRelatedItemBadge(item.relatedItem)}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600">{item.project}</p>
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            {item.trade}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="col-span-2">
                        <p className="text-gray-700 mb-4">{item.description}</p>
                        
                        <div className="space-y-2">
                          {item.checklist.map((checkItem, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className={`flex-shrink-0 h-5 w-5 rounded border ${checkItem.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center`}>
                                {checkItem.checked && <CheckCircle className="h-4 w-4 text-white" />}
                              </div>
                              <span className="ml-2 text-sm text-gray-700">{checkItem.item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.images.map((img, idx) => (
                            <div key={idx} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={img} 
                                alt={`Documentation ${idx+1}`} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 flex items-center justify-center"
                        >
                          <Camera className="h-4 w-4 mr-1.5" />
                          Tilføj billede
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-1.5" />
                        <span>{item.drawing}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>Udført {item.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 cursor-pointer hover:text-indigo-600">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>Se på tegning</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 mt-4 pt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                            {item.performedBy.split(' ').map(name => name[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-600">Udført af: {item.performedBy}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={() => handleToggleHistory(item.id)}
                          >
                            <History className="h-4 w-4 mr-1.5" />
                            Historik
                          </Button>
                          
                          {item.status === "Afventer godkendelse" && (
                            <>
                              <Button 
                                size="sm" 
                                className="flex items-center bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveQA(item.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Godkend
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex items-center bg-yellow-600 hover:bg-yellow-700"
                                onClick={() => handleRequestChanges(item.id)}
                              >
                                <AlertCircle className="h-4 w-4 mr-1.5" />
                                Rettelser påkrævet
                              </Button>
                            </>
                          )}
                          
                          {item.status === "Rettelser påkrævet" && (
                            <Button 
                              size="sm" 
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Plus className="h-4 w-4 mr-1.5" />
                              Upload rettelser
                            </Button>
                          )}
                          
                          {item.status === "Godkendt" && (
                            <Button 
                              size="sm" 
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                            >
                              <FileCheck className="h-4 w-4 mr-1.5" />
                              Til dokumentation
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {showHistory === item.id && (
                        <div className="mt-4 bg-gray-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Historik</h4>
                          <div className="space-y-2">
                            {item.history.map((historyItem, idx) => (
                              <div key={idx} className="flex">
                                <div className="w-8 text-center">
                                  <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-xs mx-auto">
                                    {historyItem.by}
                                  </div>
                                </div>
                                <div className="ml-3 pb-2 border-l border-gray-200 pl-4 flex-1">
                                  <p className="text-sm font-medium">{historyItem.action}</p>
                                  <p className="text-xs text-gray-500">{historyItem.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kvalitetssikring;
