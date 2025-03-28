
export interface Customer {
  id: string;
  name: string;
  cvr: string;
  address: string;
  contactPersons: ContactPerson[];
  role: string;
  invoiceEmail: string;
  paymentTerms: string;
  created_at?: string;
  updated_at?: string;
  is_pinned?: boolean;
}

export interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
}

export type CustomerRole = 
  | "bygherre" 
  | "hovedentreprenør" 
  | "underentreprenør" 
  | "leverandør" 
  | "rådgiver" 
  | "andet";

export type PaymentTerms = 
  | "8 dage" 
  | "14 dage" 
  | "30 dage" 
  | "løbende måned + 15 dage" 
  | "løbende måned + 30 dage";
