import type { InvoiceItem } from '../types/invoices';

export const calculateInvoiceTotals = (items: InvoiceItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0);
  const taxes = items.reduce(
    (acc, item) => acc + item.qty * item.unitPrice * (item.taxRate ?? 0),
    0
  );
  const total = subtotal + taxes;
  return { subtotal, taxes, total };
};

export const generateInvoiceNumber = (sequence: number) => {
  return `INV-${sequence.toString().padStart(6, '0')}`;
};

