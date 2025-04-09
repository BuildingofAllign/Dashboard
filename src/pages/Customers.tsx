import React, { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { CustomersContent } from "@/components/customers/CustomersContent";
import { CustomerFormDialog } from "@/components/customers/CustomerFormDialog";
import { ViewMode } from "@/components/ui/ViewToggle";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Download, Upload, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Header } from "@/components/layout/Header";
import { Separator } from "@/components/ui/separator";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DashboardLayout } from "../App";

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
  
  useEffect(() => {
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

  const handleImportExport = (action: 'import' | 'export') => {
    if (action === 'import') {
      toast.success("Importfunktion", {
        description: "Importfunktionen er ikke implementeret endnu"
      });
    } else {
      toast.success("Eksportfunktion", {
        description: "Eksportfunktionen er ikke implementeret endnu"
      });
    }
  };

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
    <DashboardLayout>
      <Header title="Kunder" userInitials="BL" />
      <div className="container py-6 space-y-6 max-w-7xl mx-auto">
        {/* Breadcrumb and action buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Hjem</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Kunder</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Avanceret
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Avancerede handlinger</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleImportExport('import')}>
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Importer kunder</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImportExport('export')}>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Eksporter kunder</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="transition-all hover:bg-primary/90"
              size="sm"
            >
              Opret kunde
            </Button>
          </div>
        </div>
        
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
    </DashboardLayout>
  );
};

export default Customers;
