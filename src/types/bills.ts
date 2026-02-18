export type BillStatus = 'pending' | 'paid' | 'overdue' | 'void';

export interface Bill {
  id: string;
  companyId: string;
  vendorInvoiceNumber: string;
  issueDate: string;
  dueDate: string;
  vendorId: string;
  total: number;
  status: BillStatus;
}

