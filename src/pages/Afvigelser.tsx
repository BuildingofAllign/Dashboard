
import React from "react";
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
  MessageSquare
} from "lucide-react";

// Dummy data for the deviations page
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
    assignedTo: "Jens Paulsen"
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
    assignedTo: "Boktogan Saruhan"
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
    assignedTo: "Mette Nielsen"
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
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Afvigelser" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar placeholder="Søg efter afvigelser..." />
            <div className="flex gap-2 mt-4 md:mt-0">
              <FilterSelect>
                <option>Alle projekter</option>
                <option>Projekt Skovvej 12</option>
                <option>Projekt Havnegade 8</option>
                <option>Projekt Stationsvej 23</option>
              </FilterSelect>
              <FilterSelect>
                <option>Alle statuser</option>
                <option>Afventer</option>
                <option>Godkendt</option>
                <option>Afvist</option>
              </FilterSelect>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-1" />
                Opret afvigelse
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {deviations.map((deviation) => (
              <Card key={deviation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100">
                      <img 
                        src={deviation.image} 
                        alt={deviation.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{deviation.title}</h3>
                            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {deviation.id}
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
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1.5" />
                          <span>Se på tegning</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                            {deviation.assignedTo.split(' ').map(name => name[0]).join('')}
                          </div>
                          <span className="text-sm text-gray-600">Tildelt: {deviation.assignedTo}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Kommentarer
                          </Button>
                          {deviation.status === "Afvist" && (
                            <Button size="sm" className="flex items-center bg-indigo-600 hover:bg-indigo-700">
                              <Plus className="h-4 w-4 mr-1.5" />
                              Konverter til tillægsopgave
                            </Button>
                          )}
                          {deviation.status === "Godkendt" && (
                            <Button size="sm" className="flex items-center bg-green-600 hover:bg-green-700">
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
