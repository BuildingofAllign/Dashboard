
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Kvalitetssikring: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Kvalitetssikring" userInitials="BL" />
          
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Kvalitetssikring</h2>
            
            <div className="p-8 text-center">
              <p className="text-gray-500">
                Kvalitetssikringsmodulet er under udvikling. Her vil du snart kunne håndtere kvalitetssikringsopgaver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Kvalitetssikring;
