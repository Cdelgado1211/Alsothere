import { calculateInvoiceTotals } from '../../lib/invoice';
import { bankAccountService } from '../bankAccountService';
import { invoiceService } from '../invoiceService';
import { mockDb } from '../mockDb';

describe('invoice totals', () => {
  it('calculates subtotal, taxes and total correctly', () => {
    const items = [
      { description: 'A', qty: 2, unitPrice: 100, taxRate: 0.16 },
      { description: 'B', qty: 1, unitPrice: 50, taxRate: 0.16 }
    ];
    const { subtotal, taxes, total } = calculateInvoiceTotals(items);
    expect(subtotal).toBe(250);
    expect(Number(taxes.toFixed(2))).toBe(40);
    expect(Number(total.toFixed(2))).toBe(290);
  });
});

describe('invoice payment and bank movement', () => {
  it('marks invoice as paid and updates bank balance', () => {
    const companyId = 'tenant-1';
    const db = mockDb.getCompany(companyId);
    const account = db.bankAccounts[0];
    const initialBalance = account.balance;
    const invoice = db.invoices[0];

    const result = invoiceService.markAsPaid(companyId, invoice.id, account.id);
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.invoice.status).toBe('paid');

    const updatedAccount = bankAccountService.get(companyId, account.id);
    expect(updatedAccount?.balance).toBe(initialBalance + invoice.total);
  });
});

