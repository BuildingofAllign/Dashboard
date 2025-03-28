
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
import { Skeleton } from "@/components/ui/skeleton";

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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-[180px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[120px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-[90px] rounded-full" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    ) : (
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
    <div className="border rounded-md overflow-hidden">
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
            <TableRow key={customer.id} className={customer.is_pinned ? "bg-primary/[0.03]" : ""}>
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
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    customer.role === "bygherre" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                    customer.role === "hovedentreprenør" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                    customer.role === "underentreprenør" ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" :
                    customer.role === "leverandør" ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" :
                    customer.role === "rådgiver" ? "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800" :
                    "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }`}
                >
                  {customer.role}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem 
                      onClick={() => handlePinWithToast(customer.id, !!customer.is_pinned)}
                      className="flex items-center gap-2"
                    >
                      <Pin className="h-4 w-4" />
                      {customer.is_pinned ? "Fjern fra favoritter" : "Tilføj til favoritter"}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleEditCustomer(customer)}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Rediger
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive flex items-center gap-2"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <Mail className="h-4 w-4" />
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
