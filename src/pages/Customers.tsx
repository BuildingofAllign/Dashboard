
import React, { useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { CustomersContent } from "@/components/customers/CustomersContent";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";
import { ViewMode } from "@/components/ui/ViewToggle";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Header } from "@/components/layout/Header";
import { Separator } from "@/components/ui/separator";
import { CustomerCard } from "@/components/customers/CustomerCard";

const Customers = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(
    localStorage.getItem('customerViewMode') as ViewMode || 'grid'
  );
  
  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredAndSortedCustomers,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    handleTogglePin,
    loadingCustomers,
    error
  } = useCustomers();
  
  React.useEffect(() => {
    localStorage.setItem('customerViewMode', viewMode);
  }, [viewMode]);
  
  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setIsCreateDialogOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingCustomer) {
      handleUpdateCustomer(editingCustomer.id, data);
      toast.success("Kunde opdateret", {
        description: `${data.name} er blevet opdateret`,
      });
    } else {
      const newCustomer = handleCreateCustomer(data);
      toast.success("Kunde oprettet", {
        description: `${newCustomer.name} er blevet tilføjet`,
      });
    }
    setEditingCustomer(null);
  };
  
  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingCustomer(null);
  };
  
  const pinnedCustomers = filteredAndSortedCustomers.filter(c => c.is_pinned);

  if (error) {
    return (
      <>
        <Header title="Kunder" userInitials="BL" />
        <div className="container py-6 max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Fejl ved indlæsning af kunder</AlertTitle>
            <AlertDescription>
              Der opstod en fejl ved indlæsning af kunder. Prøv at genindlæse siden.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Kunder" userInitials="BL" />
      <div className="container py-6 space-y-6 max-w-7xl mx-auto">
        <CustomersHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          filteredAndSortedCustomers={filteredAndSortedCustomers}
        />
        
        {viewMode !== "list" && pinnedCustomers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Favoritter</h2>
              <Badge variant="secondary" className="rounded-full">
                {pinnedCustomers.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pinnedCustomers.map(customer => (
                <CustomerCard
                  key={`pinned-${customer.id}`}
                  customer={customer}
                  onPinToggle={handleTogglePin}
                />
              ))}
            </div>
            
            <Separator />
          </div>
        )}
        
        <CustomersContent 
          viewMode={viewMode}
          loadingCustomers={loadingCustomers}
          filteredAndSortedCustomers={filteredAndSortedCustomers}
          handlePinWithToast={handleTogglePin}
          handleEditCustomer={handleEditCustomer}
          handleDeleteCustomer={handleDeleteCustomer}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
        
        <CustomerFormDialog
          open={isCreateDialogOpen}
          onOpenChange={handleCloseDialog}
          mode={editingCustomer ? "edit" : "create"}
          initialData={editingCustomer}
          onSubmit={handleFormSubmit}
        />
        
        <ScrollToTopButton />
      </div>
    </>
  );
};

export default Customers;
