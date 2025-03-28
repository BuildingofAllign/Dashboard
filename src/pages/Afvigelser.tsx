
import React from "react";
import { Header } from "@/components/layout/Header";

const Afvigelser: React.FC = () => {
  return (
    <>
      <Header title="Afvigelser" userInitials="BL" />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Afvigelser</h2>
        
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Afvigelsesmodulet er under udvikling. Her vil du snart kunne håndtere afvigelser.
          </p>
        </div>
      </div>
    </>
  );
};

export default Afvigelser;
