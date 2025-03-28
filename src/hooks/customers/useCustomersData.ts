
import { useState } from 'react';
import { Customer } from '../customers-types';

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Byggefirma A/S",
    cvr: "12345678",
    address: "Byggevej 123, 2100 København Ø",
    contactPersons: [
      {
        id: "c1",
        name: "Hans Hansen",
        email: "hans@byggefirma.dk",
        phone: "12345678",
        position: "Projektleder"
      }
    ],
    role: "hovedentreprenør",
    invoiceEmail: "faktura@byggefirma.dk",
    paymentTerms: "30 dage",
    created_at: "2023-01-15T09:00:00Z",
    updated_at: "2023-03-20T14:30:00Z",
    is_pinned: true
  },
  {
    id: "2",
    name: "Bygherre & Co",
    cvr: "87654321",
    address: "Herrevej 45, 8000 Aarhus C",
    contactPersons: [
      {
        id: "c2",
        name: "Jens Jensen",
        email: "jens@bygherre.dk",
        phone: "87654321",
        position: "Direktør"
      },
      {
        id: "c3",
        name: "Mette Mikkelsen",
        email: "mette@bygherre.dk",
        phone: "23456789",
        position: "Økonomichef"
      }
    ],
    role: "bygherre",
    invoiceEmail: "regnskab@bygherre.dk",
    paymentTerms: "14 dage",
    created_at: "2023-02-10T10:15:00Z",
    updated_at: "2023-02-10T10:15:00Z"
  },
  {
    id: "3",
    name: "Rådgivning & Design ApS",
    cvr: "56781234",
    address: "Designvej 78, 5000 Odense C",
    contactPersons: [
      {
        id: "c4",
        name: "Laura Larsen",
        email: "laura@raadgivning.dk",
        phone: "34567890",
        position: "Arkitekt"
      }
    ],
    role: "rådgiver",
    invoiceEmail: "faktura@raadgivning.dk",
    paymentTerms: "løbende måned + 15 dage",
    created_at: "2023-03-05T13:45:00Z",
    updated_at: "2023-04-12T09:30:00Z"
  }
];

export const useCustomersData = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      // In a real application, this would be an API call
      // For now, we'll just use the mock data and add a slight delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setCustomers(mockCustomers);
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error fetching customers:", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  return {
    customers,
    setCustomers,
    loadingCustomers,
    error,
    fetchCustomers
  };
};
