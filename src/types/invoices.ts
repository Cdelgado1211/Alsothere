export type InvoiceStatus = 'draft' | 'issued' | 'overdue' | 'paid' | 'void';

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  taxRate?: number;
}

export interface Invoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  total: number;
  status: InvoiceStatus;
}

