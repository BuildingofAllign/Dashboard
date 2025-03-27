
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Image, 
  MapPin, 
  Clipboard, 
  User, 
  Calendar,
  Download,
  Plus,
  HistoryIcon,
  Eye
} from "lucide-react";

// Dummy data for the quality assurance page
const qualityChecks = [
  {
    id: "KS-001",
    title: "Armering i betondæk",
    project: "Projekt Skovvej 12",
    drawing: "Konstruktionstegning K01",
    created: "1 dag siden",
    status: "Godkendt",
    images: ["https://images.unsplash.com/photo-1461749280684-dccba630e2f6"],
    description: "Inspektion af armeringsjern i det sydvestlige hjørne af betonfundamentet. Alle jern korrekt placeret efter afvigelse AFV-001.",
    relatedItem: "AFV-001",
    relatedType: "Afvigelse",
    checkedBy: "Jens Paulsen",
    approvedBy: "Mette Nielsen",
    date: "15-06-2023"
  },
  {
    id: "KS-002",
    title: "Stikkontakt i køkken",
    project: "Projekt Havnegade 8",
    drawing: "El-tegning E03",
    created: "2 dage siden",
    status: "Afventer godkendelse",
    images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12"],
    description: "Stikkontakt i køkkenet er flyttet 15 cm til venstre pga. vandrør som godkendt i tillægsopgave ATS-002.",
    relatedItem: "ATS-002",
    relatedType: "Tillægsopgave",
    checkedBy: "Boktogan Saruhan",
    approvedBy: "",
    date: "14-06-2023"
  },
  {
    id: "KS-003",
    title: "Tagspær montering",
    project: "Projekt Stationsvej 23",
    drawing: "Tagplan T02",
    created: "4 dage siden",
    status: "Godkendt",
    images: ["https://images.unsplash.com/photo-1590274853856-f22d5ee3d228"],
    description: "Kontrol af tagspær afstande og fastgørelse. Udført i henhold til revideret tegning efter godkendt tillægsopgave.",
    relatedItem: "",
    relatedType: "",
    checkedBy: "Mette Nielsen",
    approvedBy: "Jens Paulsen",
    date: "12-06-2023"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Godkendt":
      return "bg-green-100 text-green-800";
    case "Afventer godkendelse":
      return "bg-yellow-100 text-yellow-800";
    case "Afvist":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRelatedTypeColor = (type: string) => {
  switch (type) {
    case "Afvigelse":
      return "bg-purple-100 text-purple-800";
    case "Tillægsopgave":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Kvalitetssikring: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Kvalitetssikring" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar placeholder="Søg efter KS punkter..." />
            <div className="flex gap-2 mt-4 md:mt-0">
              <FilterSelect>
                <option>Alle projekter</option>
                <option>Projekt Skovvej 12</option>
                <option>Projekt Havnegade 8</option>
                <option>Projekt Stationsvej 23</option>
              </FilterSelect>
              <FilterSelect>
                <option>Alle fag</option>
                <option>Tømrer</option>
                <option>Elektriker</option>
                <option>VVS</option>
                <option>Murer</option>
              </FilterSelect>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-1" />
                Opret KS punkt
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-1.5" />
              Eksportér rapport (PDF)
            </Button>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {qualityChecks.map((check) => (
              <Card key={check.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row w-full">
                    <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100">
                      {check.images.length > 0 ? (
                        <img 
                          src={check.images[0]} 
                          alt={check.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      {check.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
                          +{check.images.length - 1} mere
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between mb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{check.title}</h3>
                            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {check.id}
                            </span>
                            {check.relatedItem && (
                              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRelatedTypeColor(check.relatedType)}`}>
                                {check.relatedType}: {check.relatedItem}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{check.project}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                            {check.status === "Godkendt" ? <CheckCircle className="h-4 w-4 mr-1.5" /> : <Clock className="h-4 w-4 mr-1.5" />}
                            {check.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{check.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
                        <div className="flex items-start">
                          <Clipboard className="h-4 w-4 mr-1.5 mt-0.5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Dokumentation</p>
                            <p className="text-gray-600">{check.drawing}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <User className="h-4 w-4 mr-1.5 mt-0.5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Kontrolleret af</p>
                            <p className="text-gray-600">{check.checkedBy}</p>
                            {check.approvedBy && (
                              <p className="text-gray-600">Godkendt af: {check.approvedBy}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-1.5 mt-0.5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Dato</p>
                            <p className="text-gray-600">{check.date}</p>
                            <p className="text-gray-500 text-xs">Oprettet {check.created}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-center mt-6">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center">
                            <HistoryIcon className="h-4 w-4 mr-1.5" />
                            Historik
                          </Button>
                          
                          <Button variant="outline" size="sm" className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1.5" />
                            Se på tegning
                          </Button>
                          
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Eye className="h-4 w-4 mr-1.5" />
                            Se detaljer
                          </Button>
                          
                          {check.status === "Afventer godkendelse" && (
                            <Button size="sm" className="flex items-center bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1.5" />
                              Godkend
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

export default Kvalitetssikring;
