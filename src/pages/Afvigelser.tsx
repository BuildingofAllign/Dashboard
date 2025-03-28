
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useDeviations } from "@/hooks/use-deviations";
import { Button } from "@/components/ui/button";
import { DeviationForm } from "@/components/deviations/DeviationForm";
import { PlusCircle } from "lucide-react";

const Afvigelser = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { deviations, loadingDeviations } = useDeviations();

  return (
    <div className="flex flex-col h-full">
      <Header title="Afvigelser" userInitials="BL" />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Registrerede afvigelser</h2>
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ny afvigelse
          </Button>
        </div>

        {loadingDeviations ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : deviations.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {deviations.map((deviation) => (
              <div 
                key={deviation.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border p-6"
              >
                <h3 className="font-medium text-lg mb-2">{deviation.title}</h3>
                <p className="text-muted-foreground mb-4">{deviation.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 px-2 py-1 rounded">
                    {deviation.status}
                  </span>
                  <span className="text-muted-foreground">
                    {deviation.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Ingen afvigelser registreret endnu.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsFormOpen(true)}
            >
              Registrer første afvigelse
            </Button>
          </div>
        )}
      </div>

      <DeviationForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
};

export default Afvigelser;
