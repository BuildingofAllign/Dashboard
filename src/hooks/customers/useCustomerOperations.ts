
import { toast } from 'sonner';
import { Customer } from '../customers-types';

export const useCustomerOperations = (
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
) => {
  const handleTogglePin = (customerId: string, isPinned: boolean) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, is_pinned: !isPinned } 
          : customer
      )
    );
    
    toast.success(isPinned ? "Kunde fjernet fra favoritter" : "Kunde tilføjet til favoritter", {
      description: isPinned 
        ? "Kunden vil ikke længere være fastgjort til toppen" 
        : "Kunden vil nu være fastgjort til toppen af listen",
      duration: 3000,
    });
  };

  const handleCreateCustomer = (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(), // Use timestamp as temporary ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const handleUpdateCustomer = (customerId: string, customerData: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { 
              ...customer, 
              ...customerData, 
              updated_at: new Date().toISOString()
            }
          : customer
      )
    );
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  return {
    handleTogglePin,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  };
};
