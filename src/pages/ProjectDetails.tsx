import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "../App";

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <DashboardLayout>
      <Header title="Projektdetaljer" userInitials="BL" />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Projekt ID: {id}</h2>
        
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Projektdetaljesiden er under udvikling. Her vil du snart kunne se detaljer for det valgte projekt.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
