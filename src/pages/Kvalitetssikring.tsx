import React from "react";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "../App";

const Kvalitetssikring: React.FC = () => {
  return (
    <DashboardLayout>
      <Header title="Kvalitetssikring" userInitials="BL" />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Kvalitetssikring</h2>
        
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Kvalitetssikringsmodulet er under udvikling. Her vil du snart kunne håndtere kvalitetssikringsopgaver.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Kvalitetssikring;
