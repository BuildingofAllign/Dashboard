
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
  UserCheck
} from "lucide-react";

// Dummy data for deviations
const deviations = [
  {
    id: "AFV-001",
    title: "Manglende armeringsjern i betondæk",
    project: "Projekt Skovvej 12",
    drawing: "Konstruktionstegning K01",
    created: "3 dage siden",
    status: "Afventer",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    description: "Ved inspektion af betonfundamentet blev det konstateret, at der mangler 3 armeringsjern i det sydvestlige hjørne.",
    assignedTo: "Jens Paulsen",
    approverRole: "Ingeniør",
    location: { x: 156, y: 223 },
    comments: [
      { author: "JP", text: "Hvad skal jeg gøre her? Skal vi følge oprindelig spec?", time: "3 dage siden" },
      { author: "BL", text: "Afventer svar fra ingeniør.", time: "2 dage siden" }
    ]
  },
  {
    id: "AFV-002",
    title: "Fejlplaceret elinstallation",
    project: "Projekt Havnegade 8",
    drawing: "El-tegning E03",
    created: "5 dage siden",
    status: "Godkendt",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    description: "Stikkontakten i køkkenet er placeret 15 cm længere til venstre end på tegningen grundet vandrør.",
    assignedTo: "Boktogan Saruhan",
    approverRole: "Kunderepræsentant",
    location: { x: 345, y: 156 },
    comments: [
      { author: "BS", text: "Har måtte flytte stikkontakt pga. vandrør.", time: "5 dage siden" },
      { author: "MN", text: "Det er ok. Godkendt med små ændringer.", time: "4 dage siden" }
    ]
  },
  {
    id: "AFV-003",
    title: "Tagkonstruktion afviger fra tegning",
    project: "Projekt Stationsvej 23",
    drawing: "Tagplan T02",
    created: "1 uge siden",
    status: "Afvist",
    image: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228",
    description: "Tagspær er monteret med anden afstand end på tegningen, hvilket medfører ændring i placering af vinduer.",
    assignedTo: "Mette Nielsen",
    approverRole: "Ingeniør",
    location: { x: 278, y: 412 },
    comments: [
      { author: "MN", text: "Spærene passer ikke med tegningen. Hvad gør vi?", time: "1 uge siden" },
      { author: "BL", text: "Dette kræver redesign. Afvist til fordel for tillægsopgave.", time: "6 dage siden" }
    ]
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Afventer":
      return "bg-yellow-100 text-yellow-800";
    case "Godkendt":
      return "bg-green-100 text-green-800";
    case "Afvist":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Afventer":
      return <Clock className="h-4 w-4 mr-1.5" />;
    case "Godkendt":
      return <CheckCircle className="h-4 w-4 mr-1.5" />;
    case "Afvist":
      return <XCircle className="h-4 w-4 mr-1.5" />;
    default:
      return <AlertCircle className="h-4 w-4 mr-1.5" />;
  }
};

const Afvigelser: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approverFilter, setApproverFilter] = useState("all");

  const filteredDeviations = deviations.filter((deviation) => {
    // Search filter
    const matchesSearch = 
      deviation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deviation.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = projectFilter === "all" || deviation.project === projectFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || deviation.status === statusFilter;
    
    // Approver filter
    const matchesApprover = approverFilter === "all" || deviation.approverRole === approverFilter;
    
    return matchesSearch && matchesProject && matchesStatus && matchesApprover;
  });

  const handleCreateDeviation = () => {
    toast.success("Ny afvigelse oprettet!", {
      description: "Afvigelse tildelt et unikt ID og afventer godkendelse."
    });
  };

  const handleApproveDeviation = (id: string) => {
    toast.success(`Afvigelse ${id} godkendt`, {
      description: "Afvigelsen er nu sendt til kvalitetssikring."
    });
  };

  const handleRejectDeviation = (id: string) => {
    toast.error(`Afvigelse ${id} afvist`, {
      description: "Afvigelsen kan konverteres til en tillægsopgave."
    });
  };

  const handleConvertToAdditionalTask = (id: string) => {
    toast.success(`Afvigelse ${id} konverteret til tillægsopgave`, {
      description: "Gå til Tillægsopgaver for at se den nye opgave."
    });
  };

  const handleSendToQualityAssurance = (id: string) => {
    toast.success(`Afvigelse ${id} sendt til kvalitetssikring`, {
      description: "Gå til Kvalitetssikring for at dokumentere arbejdet."
    });
  };

  const handleAddComment = (id: string) => {
    toast.success(`Kommentar tilføjet til afvigelse ${id}`, {
      description: "Alle involverede parter er blevet notificeret."
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Afvigelser" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar 
              placeholder="Søg efter afvigelser..." 
              onChange={setSearchQuery}
            />
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <FilterSelect onChange={(e) => setProjectFilter(e.target.value)}>
                <option value="all">Alle projekter</option>
                <option value="Projekt Skovvej 12">Projekt Skovvej 12</option>
                <option value="Projekt Havnegade 8">Projekt Havnegade 8</option>
                <option value="Projekt Stationsvej 23">Projekt Stationsvej 23</option>
              </FilterSelect>
              <FilterSelect onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Alle statuser</option>
                <option value="Afventer">Afventer</option>
                <option value="Godkendt">Godkendt</option>
                <option value="Afvist">Afvist</option>
              </FilterSelect>
              <FilterSelect onChange={(e) => setApproverFilter(e.target.value)}>
                <option value="all">Alle godkendere</option>
                <option value="Ingeniør">Ingeniør</option>
                <option value="Kunderepræsentant">Kunderepræsentant</option>
                <option value="Byggeleder">Byggeleder</option>
              </FilterSelect>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateDeviation}>
                <Plus className="h-5 w-5 mr-1" />
                Opret afvigelse
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {filteredDeviations.map((deviation) => (
              <Card key={deviation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100">
                      <img 
                        src={deviation.image} 
                        alt={deviation.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-2 right-2">
                        <button className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                          <Camera className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-800">{deviation.title}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {deviation.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center">
                              <UserCheck className="h-3 w-3 mr-1" />
                              {deviation.approverRole}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{deviation.project}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(deviation.status)}`}>
                            {getStatusIcon(deviation.status)}
                            {deviation.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{deviation.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-1.5" />
                          <span>{deviation.drawing}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>Oprettet {deviation.created}</span>
                        </div>
                        <div className="flex items-center text-gray-600 cursor-pointer hover:text-indigo-600">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span>Se på tegning</span>
                        </div>
                      </div>
                      
                      {deviation.comments && deviation.comments.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Seneste kommentarer</h4>
                          <div className="space-y-2">
                            {deviation.comments.slice(0, 2).map((comment, i) => (
                              <div key={i} className="flex items-start">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm mr-2">
                                  {comment.author}
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2 flex-1">
                                  <p className="text-sm">{comment.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">{comment.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {deviation.comments.length > 2 && (
                            <button className="text-sm text-indigo-600 mt-2 hover:underline">
                              Vis alle {deviation.comments.length} kommentarer
                            </button>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                            {deviation.assignedTo.split(' ').map(name => name[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-600">Tildelt: {deviation.assignedTo}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={() => handleAddComment(deviation.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Tilføj kommentar
                          </Button>
                          
                          {deviation.status === "Afventer" && (
                            <>
                              <Button 
                                size="sm" 
                                className="flex items-center bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveDeviation(deviation.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Godkend
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex items-center bg-red-600 hover:bg-red-700"
                                onClick={() => handleRejectDeviation(deviation.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1.5" />
                                Afvis
                              </Button>
                            </>
                          )}
                          
                          {deviation.status === "Afvist" && (
                            <Button 
                              size="sm" 
                              className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => handleConvertToAdditionalTask(deviation.id)}
                            >
                              <Plus className="h-4 w-4 mr-1.5" />
                              Konverter til tillægsopgave
                            </Button>
                          )}
                          
                          {deviation.status === "Godkendt" && (
                            <Button 
                              size="sm" 
                              className="flex items-center bg-green-600 hover:bg-green-700"
                              onClick={() => handleSendToQualityAssurance(deviation.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Til kvalitetssikring
                            </Button>
                          )}
                        </div>
                      </div>
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

export default Afvigelser;
