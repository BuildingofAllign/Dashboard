
import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Projektdetaljer" userInitials="BL" />
          
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Projekt ID: {id}</h2>
            
            <div className="p-8 text-center">
              <p className="text-gray-500">
                Projektdetaljesiden er under udvikling. Her vil du snart kunne se detaljer for det valgte projekt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProjectDetails;
