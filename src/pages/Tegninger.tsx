
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterSelect } from "@/components/ui/FilterButton";
import { Button } from "@/components/ui/button";
import { Upload, Image, MoreVertical, Info, Clock, FileImage } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DrawingCard } from "@/components/drawings/DrawingCard";
import { AddDrawingCard } from "@/components/drawings/AddDrawingCard";

const Tegninger: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tegninger" userInitials="BL" />
        
        <div className="p-6 pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <SearchBar placeholder="Søg efter tegning..." />
            <div className="flex gap-2 mt-4 md:mt-0">
              <FilterSelect>
                <option>Alle projekter</option>
                <option>Projekt Skovvej 12</option>
                <option>Projekt Havnegade 8</option>
                <option>Projekt Stationsvej 23</option>
              </FilterSelect>
              <FilterSelect>
                <option>Alle typer</option>
                <option>Plantegning</option>
                <option>Snittegning</option>
                <option>Detailtegning</option>
                <option>El</option>
                <option>VVS</option>
              </FilterSelect>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Upload className="h-5 w-5 mr-1" />
                Upload tegning
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 pt-0 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DrawingCard 
              title="Plantegning stue"
              project="Projekt Skovvej 12"
              version="v2.1"
              imageSrc="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
              deviations={2}
              additionalTasks={1}
              updatedDaysAgo={3}
              annotationMarkers={[
                { id: 1, position: "top-1/4 left-1/3", color: "bg-indigo-500" },
                { id: 2, position: "top-1/2 right-1/4", color: "bg-red-500" }
              ]}
            />
            
            <DrawingCard 
              title="VVS installationsplan"
              project="Projekt Skovvej 12"
              version="v1.5"
              imageSrc="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
              deviations={1}
              additionalTasks={0}
              updatedDaysAgo={7}
              annotationMarkers={[
                { id: 1, position: "bottom-1/3 left-1/4", color: "bg-red-500" }
              ]}
            />
            
            <DrawingCard 
              title="Facadetegning"
              project="Projekt Skovvej 12"
              version="v1.0"
              imageSrc="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
              deviations={0}
              additionalTasks={0}
              updatedDaysAgo={14}
              annotationMarkers={[]}
            />
            
            <AddDrawingCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tegninger;
