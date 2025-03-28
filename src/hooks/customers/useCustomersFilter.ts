
import { useState, useMemo } from 'react';
import { Customer } from '../customers-types';

export const useCustomersFilter = (customers: Customer[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  const filteredAndSortedCustomers = useMemo(() => {
    // First filter by search query and role
    let filtered = customers.filter(customer => {
      const matchesQuery = searchQuery 
        ? customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.cvr.includes(searchQuery) ||
          customer.contactPersons.some(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            p.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
      
      const matchesRole = roleFilter 
        ? customer.role === roleFilter
        : true;
      
      return matchesQuery && matchesRole;
    });

    // Then sort: pinned first, then alphabetically by name
    return [...filtered].sort((a, b) => {
      // First by pin status
      if ((a.is_pinned && b.is_pinned) || (!a.is_pinned && !b.is_pinned)) {
        // If pin status is the same, sort alphabetically
        return a.name.localeCompare(b.name);
      }
      return a.is_pinned ? -1 : 1;
    });
  }, [customers, searchQuery, roleFilter]);

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredAndSortedCustomers
  };
};
