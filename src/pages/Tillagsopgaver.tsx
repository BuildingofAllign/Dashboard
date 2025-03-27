
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  DollarSign, 
  FileText, 
  Tool,
  CheckCircle, 
  XCircle,
  MessageSquare,
  CalendarClock,
  Package,
  Plus
} from "lucide-react";

// Dummy data for the additional tasks page
const additionalTasks = [
  {
    id: "ATS-001",
    title: "Ekstra armeringsjern i betondæk",
    project: "Projekt Skovvej 12",
    drawing: "Konstruktionstegning K01",
    created: "2 dage siden",
    status: "Afventer",
    price: "4.500 kr",
    timeEstimate: "8 timer",
    materials: "6 stk. armeringsjern, 25kg beton",
    description: "Installation af ekstra armeringsjern i det sydvestlige hjørne af fundamentet for at øge bæreevnen.",
    fromDeviation: "AFV-001",
    assignedTo: "Jens Paulsen"
  },
  {
    id: "ATS-002",
    title: "Flytning af stikkontakt",
    project: "Projekt Havnegade 8",
    drawing: "El-tegning E03",
    created: "4 dage siden",
    status: "Godkendt",
    price: "1.200 kr",
    timeEstimate: "2 timer",
    materials: "Kabel, vægdåse, stikkontakt",
    description: "Flytning af stikkontakt i køkkenet 15 cm til venstre grundet uforudsete vandrør i væggen.",
    fromDeviation: "AFV-002",
    assignedTo: "Boktogan Saruhan"
  },
  {
    id: "ATS-003",
    title: "Ændring af tagkonstruktion",
    project: "Projekt Stationsvej 23",
    drawing: "Tagplan T02",
    created: "1 uge siden",
    status: "Afvist",
    price: "28.500 kr",
    timeEstimate: "3 dage",
    materials: "14 spær, 120 m² tagpap, 80 lægter",
    description: "Komplet revision af tagkonstruktionen med ændrede spærafstande og forstærkning af enkelte spær.",
    fromDeviation: "AFV-003",
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
      return <Clock className="h-4 w-4 mr-1.5" />;
  }
};

const Tillagsopgaver: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tillægsopgaver" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar placeholder="Søg efter tillægsopgaver..." />
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
                Opret tillægsopgave
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="space-y-4">
            {additionalTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {task.id}
                          </span>
                          {task.fromDeviation && (
                            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Fra afvigelse: {task.fromDeviation}
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
                    
                    <p className="text-gray-700">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 font-medium mb-1">
                          <DollarSign className="h-4 w-4 mr-1.5 text-indigo-600" />
                          Pris
                        </div>
                        <p className="text-gray-900 font-semibold">{task.price}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 font-medium mb-1">
                          <CalendarClock className="h-4 w-4 mr-1.5 text-indigo-600" />
                          Tidsforbrug
                        </div>
                        <p className="text-gray-900 font-semibold">{task.timeEstimate}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 font-medium mb-1">
                          <Package className="h-4 w-4 mr-1.5 text-indigo-600" />
                          Materialer
                        </div>
                        <p className="text-gray-900 font-semibold">{task.materials}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center text-gray-700 font-medium mb-1">
                          <FileText className="h-4 w-4 mr-1.5 text-indigo-600" />
                          Tegning
                        </div>
                        <p className="text-gray-900 font-semibold">{task.drawing}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2 text-sm">
                          {task.assignedTo.split(' ').map(name => name[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-600">Ansvarlig: {task.assignedTo}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1.5" />
                          Kommentarer
                        </Button>
                        
                        {task.status === "Godkendt" && (
                          <Button size="sm" className="flex items-center bg-indigo-600 hover:bg-indigo-700">
                            <Tool className="h-4 w-4 mr-1.5" />
                            Markér som udført
                          </Button>
                        )}
                        
                        {task.status === "Godkendt" && (
                          <Button size="sm" className="flex items-center bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1.5" />
                            Til kvalitetssikring
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
