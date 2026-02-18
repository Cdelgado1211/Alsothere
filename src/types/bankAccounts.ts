export type MovementType = 'income' | 'expense';

export interface BankAccount {
  id: string;
  companyId: string;
  name: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number;
}

export interface BankMovement {
  id: string;
  companyId: string;
  bankAccountId: string;
  date: string;
  type: MovementType;
  referenceType: 'customerInvoice' | 'vendorBill';
  referenceId: string;
  amount: number;
  resultingBalance: number;
}

