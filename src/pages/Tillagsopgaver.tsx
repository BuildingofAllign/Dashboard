
import React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Tillagsopgaver: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Tillægsopgaver" userInitials="BL" />
          
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Tillægsopgaver</h2>
            
            <div className="p-8 text-center">
              <p className="text-gray-500">
                Tillægsopgavemodulet er under udvikling. Her vil du snart kunne administrere tillægsopgaver.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Tillagsopgaver;
