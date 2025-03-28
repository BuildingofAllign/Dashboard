
import { useEffect } from 'react';
import { useCustomersData } from './customers/useCustomersData';
import { useCustomersFilter } from './customers/useCustomersFilter';
import { useCustomerOperations } from './customers/useCustomerOperations';
import { Customer } from './customers-types';

export type { Customer };

export const useCustomers = () => {
  const { 
    customers, 
    setCustomers, 
    loadingCustomers, 
    error, 
    fetchCustomers 
  } = useCustomersData();

  const {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredAndSortedCustomers
  } = useCustomersFilter(customers);

  const {
    handleTogglePin,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer
  } = useCustomerOperations(setCustomers);

  // Load customers on initial render
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    filteredAndSortedCustomers,
    loadingCustomers,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    fetchCustomers,
    handleTogglePin,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    error
  };
};
