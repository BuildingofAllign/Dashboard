
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  DollarSign,
  Calendar,
  Package
} from "lucide-react";
import { toast } from "sonner";

// Dummy data for additional tasks
const additionalTasks = [
  {
    id: "AT-001",
    title: "Ændret placering af elinstallationer",
    project: "Projekt Havnegade 8",
    drawing: "El-tegning E03",
    created: "3 dage siden",
    status: "Afventer",
    price: 4500,
    timeRequired: "6 timer",
    materials: "2x stikkontakter, 15m kabel",
    description: "Stikkontakter skal flyttes 30cm fra oprindelig placering grundet ændret design af køkkenelementer.",
    assignedTo: "Boktogan Saruhan",
    fromDeviation: "AFV-002"
  },
  {
    id: "AT-002",
    title: "Ekstra forstærkning af tagkonstruktion",
    project: "Projekt Stationsvej 23",
    drawing: "Tagplan T02",
    created: "6 dage siden",
    status: "Godkendt",
    price: 12800,
    timeRequired: "2 dage",
    materials: "8x spær forstærkninger, 32x beslag",
    description: "Efter konstatering af afvigelse i tagkonstruktionen, er ekstra forstærkning nødvendig for at sikre stabilitet.",
    assignedTo: "Mette Nielsen",
    fromDeviation: "AFV-003"
  },
  {
    id: "AT-003",
    title: "Udskiftning af betontype i fundament",
    project: "Projekt Skovvej 12",
    drawing: "Konstruktionstegning K01",
    created: "1 uge siden",
    status: "Afvist",
    price: 18500,
    timeRequired: "1 dag",
    materials: "3m³ højstyrkebeton",
    description: "Grundet konstateret højtstående grundvand anbefales udskiftning til mere fugtresistent betonblanding.",
    assignedTo: "Jens Paulsen",
    fromDeviation: null
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

const Tillagsopgaver: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = additionalTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = projectFilter === "all" || task.project === projectFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  const handleAddNewTask = () => {
    toast.success("Ny tillægsopgave oprettet!", {
      description: "Du kan redigere detaljerne nu."
    });
  };

  const handleApproveTask = (id: string) => {
    toast.success(`Tillægsopgave ${id} godkendt`, {
      description: "Opgaven er nu klar til udførelse."
    });
  };
  
  const handleRejectTask = (id: string) => {
    toast.error(`Tillægsopgave ${id} afvist`, {
      description: "Se kommentarer for detaljer."
    });
  };

  const handleSendToQA = (id: string) => {
    toast.success(`Tillægsopgave ${id} sendt til kvalitetssikring`, {
      description: "Arbejdet er markeret som udført og klar til KS."
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tillægsopgaver" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar 
              placeholder="Søg efter tillægsopgave..." 
              onChange={setSearchQuery}
            />
            <div className="flex gap-2 mt-4 md:mt-0">
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
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAddNewTask}>
                <Plus className="h-5 w-5 mr-1" />
                Opret tillægsopgave
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-3">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {task.id}
                          </span>
                          {task.fromDeviation && (
                            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Fra afvigelse {task.fromDeviation}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{task.project}</p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          {task.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Pris</p>
                          <p className="font-medium">{task.price.toLocaleString()} kr.</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Tidsforbrug</p>
                          <p className="font-medium">{task.timeRequired}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                        <Package className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-500">Materialer</p>
                          <p className="font-medium">{task.materials}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-1.5" />
                        <span>{task.drawing}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>Oprettet {task.created}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        <span>Se på tegning</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                          {task.assignedTo.split(' ').map(name => name[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600">Tildelt: {task.assignedTo}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          Kommentarer
                        </Button>
                        
                        {task.status === "Afventer" && (
                          <>
                            <Button 
                              onClick={() => handleApproveTask(task.id)}
                              size="sm" 
                              className="flex items-center bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Godkend
                            </Button>
                            <Button 
                              onClick={() => handleRejectTask(task.id)}
                              size="sm" 
                              className="flex items-center bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Afvis
                            </Button>
                          </>
                        )}
                        
                        {task.status === "Godkendt" && (
                          <Button 
                            onClick={() => handleSendToQA(task.id)}
                            size="sm" 
                            className="flex items-center bg-indigo-600 hover:bg-indigo-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Markér udført og send til KS
                          </Button>
                        )}
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

export default Tillagsopgaver;
