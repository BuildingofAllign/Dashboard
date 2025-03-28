
import React from "react";
import { Header } from "@/components/layout/Header";

const Tillagsopgaver: React.FC = () => {
  return (
    <>
      <Header title="Tillægsopgaver" userInitials="BL" />
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Tillægsopgaver</h2>
        
        <div className="p-8 text-center">
          <p className="text-gray-500">
            Tillægsopgavemodulet er under udvikling. Her vil du snart kunne administrere tillægsopgaver.
          </p>
        </div>
      </div>
    </>
  );
};

export default Tillagsopgaver;
