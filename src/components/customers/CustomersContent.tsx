
import React, { useState } from 'react';
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
import { Building2, Mail, MoreHorizontal, Phone, Pin, UserPlus, Users, Tag, Copy, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from '../ui/checkbox';
import { InlineEditableCard } from '../ui/InlineEditableCard';
import { BulkActionsBar, commonBulkActions, BulkAction } from '../ui/BulkActionsBar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner';
import { CustomerFormDialog } from './CustomerFormDialog';

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
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isBulkAssignDialogOpen, setIsBulkAssignDialogOpen] = useState(false);

  const handleSelectCustomer = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedCustomers(prev => [...prev, id]);
    } else {
      setSelectedCustomers(prev => prev.filter(customerId => customerId !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCustomers(filteredAndSortedCustomers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  const handleBulkDelete = () => {
    // In a real implementation, this would call an API to delete the selected customers
    selectedCustomers.forEach(id => handleDeleteCustomer(id));
    setSelectedCustomers([]);
    setIsBulkDeleteDialogOpen(false);
    toast.success(`${selectedCustomers.length} customers deleted successfully`);
  };

  const handleBulkAssign = () => {
    // This would be implemented with actual role assignment logic
    setIsBulkAssignDialogOpen(false);
    setSelectedCustomers([]);
    toast.success(`Updated role for ${selectedCustomers.length} customers`);
  };

  const handleBulkDuplicate = () => {
    // This would duplicate the selected customers
    toast.success(`${selectedCustomers.length} customers duplicated`);
    setSelectedCustomers([]);
  };

  const bulkActions: BulkAction[] = [
    commonBulkActions.assignTo(() => setIsBulkAssignDialogOpen(true)),
    commonBulkActions.duplicate(handleBulkDuplicate),
  ];

  const secondaryBulkActions: BulkAction[] = [
    commonBulkActions.delete(() => setIsBulkDeleteDialogOpen(true)),
    commonBulkActions.tag(() => {
      toast.success("Tag added to selected customers");
      setSelectedCustomers([]);
    }),
  ];

  const inlineEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    if (editingCustomer) {
      // In a real implementation, this would update the customer
      handleEditCustomer({ ...editingCustomer, ...data });
      setEditingCustomer(null);
      setIsEditDialogOpen(false);
      toast.success("Customer updated successfully");
    }
  };

  if (loadingCustomers) {
    return viewMode === 'list' ? (
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Skeleton className="h-4 w-4" /></TableHead>
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
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
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

  // Generate mock comments for demonstration
  const generateComments = (customerId: string) => {
    return [
      {
        id: `comment-1-${customerId}`,
        author: "Bjorn Larsen",
        authorInitials: "BL",
        text: "Contacted them about the new project requirements",
        createdAt: new Date(2023, 7, 15),
      },
      {
        id: `comment-2-${customerId}`,
        author: "Marina Jensen",
        authorInitials: "MJ",
        text: "They're interested in our new service offerings",
        createdAt: new Date(2023, 8, 2),
      },
    ];
  };

  // Generate mock history for demonstration
  const generateHistory = (customerId: string) => {
    return [
      {
        id: `history-1-${customerId}`,
        action: "created the customer",
        actor: "Bjorn Larsen",
        actorInitials: "BL",
        timestamp: new Date(2023, 5, 10),
      },
      {
        id: `history-2-${customerId}`,
        action: "updated contact information",
        actor: "Marina Jensen",
        actorInitials: "MJ",
        timestamp: new Date(2023, 6, 22),
      },
      {
        id: `history-3-${customerId}`,
        action: "changed role to hovedentreprenør",
        actor: "Bjorn Larsen",
        actorInitials: "BL",
        timestamp: new Date(2023, 7, 8),
      },
    ];
  };

  return (
    <>
      {viewMode === 'list' ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      filteredAndSortedCustomers.length > 0 &&
                      selectedCustomers.length === filteredAndSortedCustomers.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all customers"
                  />
                </TableHead>
                <TableHead className="w-[250px]">Virksomhed</TableHead>
                <TableHead>CVR</TableHead>
                <TableHead>Kontaktperson</TableHead>
                <TableHead>Rolle</TableHead>
                <TableHead className="text-right">Handlinger</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className={`${customer.is_pinned ? "bg-primary/[0.03]" : ""} ${selectedCustomers.includes(customer.id) ? "bg-muted" : ""}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, !!checked)}
                      aria-label={`Select ${customer.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {customer.is_pinned && (
                        <Pin className="h-3 w-3 fill-primary text-primary" />
                      )}
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-medium text-foreground hover:text-primary"
                        onClick={() => inlineEdit(customer)}
                      >
                        {customer.name}
                      </Button>
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
                          onClick={() => inlineEdit(customer)}
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Rediger
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive flex items-center gap-2"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash className="h-4 w-4" />
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
            <InlineEditableCard
              key={customer.id}
              id={customer.id}
              title={customer.name}
              subtitle={`CVR: ${customer.cvr}`}
              status={customer.role}
              statusColor={
                customer.role === "bygherre" ? "blue" :
                customer.role === "hovedentreprenør" ? "green" :
                customer.role === "underentreprenør" ? "purple" :
                customer.role === "leverandør" ? "amber" :
                customer.role === "rådgiver" ? "cyan" : 
                undefined
              }
              selectable={true}
              selected={selectedCustomers.includes(customer.id)}
              onSelect={handleSelectCustomer}
              onEdit={() => inlineEdit(customer)}
              onDelete={handleDeleteCustomer}
              onStatusChange={(id, status) => {
                // This would update the customer's role in a real implementation
                toast.success(`Changed ${customer.name}'s role to ${status}`);
              }}
              statusOptions={[
                { label: "Bygherre", value: "bygherre", color: "blue" },
                { label: "Hovedentreprenør", value: "hovedentreprenør", color: "green" },
                { label: "Underentreprenør", value: "underentreprenør", color: "purple" },
                { label: "Leverandør", value: "leverandør", color: "amber" },
                { label: "Rådgiver", value: "rådgiver", color: "cyan" },
                { label: "Andet", value: "andet" },
              ]}
              comments={generateComments(customer.id)}
              history={generateHistory(customer.id)}
              attachments={[]}
              onAddComment={(text) => {
                toast.success("Comment added");
              }}
              onAddAttachment={(file) => {
                toast.success(`File "${file.name}" uploaded`);
              }}
              className={customer.is_pinned ? "border-primary/30" : ""}
            >
              <div className="space-y-3">
                {customer.contactPersons.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Kontaktperson
                    </div>
                    <div className="pl-5">
                      <div className="text-sm">{customer.contactPersons[0].name}</div>
                      <div className="text-sm flex items-start gap-2">
                        <Phone className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <span>{customer.contactPersons[0].phone}</span>
                      </div>
                      <div className="text-sm flex items-start gap-2">
                        <Mail className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{customer.contactPersons[0].email}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{customer.address}</span>
                </div>
              </div>
            </InlineEditableCard>
          ))}
        </div>
      )}

      {/* Bulk Actions Bar */}
      <BulkActionsBar 
        selectedCount={selectedCustomers.length}
        primaryActions={bulkActions}
        secondaryActions={secondaryBulkActions}
        onClearSelection={handleClearSelection}
      />

      {/* Dialogs for bulk actions */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete customers</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCustomers.length} selected customer{selectedCustomers.length !== 1 ? 's' : ''}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkAssignDialogOpen} onOpenChange={setIsBulkAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change customer role</DialogTitle>
            <DialogDescription>
              Select a new role for the {selectedCustomers.length} selected customer{selectedCustomers.length !== 1 ? 's' : ''}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Role selection would go here */}
            <div className="flex flex-col gap-2">
              {["bygherre", "hovedentreprenør", "underentreprenør", "leverandør", "rådgiver", "andet"].map((role) => (
                <Badge 
                  key={role}
                  variant="outline" 
                  className={`capitalize p-2 cursor-pointer hover:bg-muted ${
                    role === "bygherre" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" :
                    role === "hovedentreprenør" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" :
                    role === "underentreprenør" ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800" :
                    role === "leverandør" ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" :
                    role === "rådgiver" ? "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800" :
                    "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }`}
                  onClick={() => handleBulkAssign()}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkAssignDialogOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleBulkAssign}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline editing dialog */}
      {editingCustomer && (
        <CustomerFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          mode="edit"
          initialData={editingCustomer}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
};
