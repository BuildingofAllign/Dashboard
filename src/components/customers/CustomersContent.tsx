
import React from 'react';
import { CustomerCard } from './CustomerCard';
import { Customer } from '@/hooks/customers-types';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProjectSkeleton } from '@/components/ui/ProjectSkeleton';
import { ViewMode } from '@/components/ui/ViewToggle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Mail, MoreHorizontal, Phone, Pin } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomersContentProps {
  viewMode: ViewMode;
  loadingCustomers: boolean;
  filteredAndSortedCustomers: Customer[];
  handlePinWithToast: (id: string, isPinned: boolean) => void;
  handleEditCustomer: (customer: Customer) => void;
  handleDeleteCustomer: (id: string) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const CustomersContent: React.FC<CustomersContentProps> = ({
  viewMode,
  loadingCustomers,
  filteredAndSortedCustomers,
  handlePinWithToast,
  handleEditCustomer,
  handleDeleteCustomer,
  setIsCreateDialogOpen,
}) => {
  if (loadingCustomers) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProjectSkeleton count={8} />
      </div>
    );
  }

  if (filteredAndSortedCustomers.length === 0) {
    return (
      <EmptyState
        title="Ingen kunder fundet"
        description="Prøv at justere dine filtre eller opret en ny kunde."
        icon="building"
        actionLabel="Opret ny kunde"
        onAction={() => setIsCreateDialogOpen(true)}
      />
    );
  }

  return viewMode === 'list' ? (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Virksomhed</TableHead>
            <TableHead>CVR</TableHead>
            <TableHead>Kontaktperson</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead className="text-right">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {customer.is_pinned && (
                    <Pin className="h-3 w-3 fill-primary text-primary" />
                  )}
                  {customer.name}
                </div>
              </TableCell>
              <TableCell>{customer.cvr}</TableCell>
              <TableCell>
                {customer.contactPersons.length > 0 && (
                  <div className="flex flex-col">
                    <span>{customer.contactPersons[0].name}</span>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.contactPersons[0].phone}
                    </div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{customer.role}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePinWithToast(customer.id, !!customer.is_pinned)}>
                      {customer.is_pinned ? "Fjern fra favoritter" : "Tilføj til favoritter"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                      Rediger
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      Slet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredAndSortedCustomers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onPinToggle={handlePinWithToast}
        />
      ))}
    </div>
  );
};
