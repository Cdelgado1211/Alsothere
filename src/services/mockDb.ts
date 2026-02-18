import type { Client } from '../types/clients';
import type { Vendor } from '../types/vendors';
import type { Invoice } from '../types/invoices';
import type { Bill } from '../types/bills';
import type { BankAccount, BankMovement } from '../types/bankAccounts';
import type { AuditLogEntry } from '../types/audit';
import { calculateInvoiceTotals, generateInvoiceNumber } from '../lib/invoice';
import { generateId } from '../lib/id';

interface CompanyData {
  clients: Client[];
  vendors: Vendor[];
  invoices: Invoice[];
  bills: Bill[];
  bankAccounts: BankAccount[];
  movements: BankMovement[];
  audit: AuditLogEntry[];
  invoiceSequence: number;
}

const nowIso = () => new Date().toISOString();

const createSeedCompany = (companyId: string, name: string): CompanyData => {
  const bankAccountId = generateId();
  const clientId = generateId();
  const vendorId = generateId();

  const items = [
    { description: 'Servicio de consultoría', qty: 10, unitPrice: 100, taxRate: 0.16 }
  ];
  const totals = calculateInvoiceTotals(items);

  const invoice: Invoice = {
    id: generateId(),
    companyId,
    invoiceNumber: generateInvoiceNumber(1),
    issueDate: nowIso(),
    dueDate: nowIso(),
    customerId: clientId,
    items,
    subtotal: totals.subtotal,
    taxes: totals.taxes,
    total: totals.total,
    status: 'issued'
  };

  const bill: Bill = {
    id: generateId(),
    companyId,
    vendorInvoiceNumber: 'BILL-0001',
    issueDate: nowIso(),
    dueDate: nowIso(),
    vendorId,
    total: 500,
    status: 'pending'
  };

  return {
    clients: [
      {
        id: clientId,
        companyId,
        name: `Cliente ${name}`,
        taxId: 'XAXX010101000',
        address: 'Calle Principal 123',
        phone: '555-000-0000',
        email: 'cliente@example.com',
        status: 'active',
        createdAt: nowIso()
      }
    ],
    vendors: [
      {
        id: vendorId,
        companyId,
        name: `Proveedor ${name}`,
        taxId: 'XAXX010101000',
        address: 'Av. Proveedor 456',
        phone: '555-111-1111',
        email: 'proveedor@example.com',
        status: 'active',
        createdAt: nowIso()
      }
    ],
    invoices: [invoice],
    bills: [bill],
    bankAccounts: [
      {
        id: bankAccountId,
        companyId,
        name: `Cuenta Principal ${name}`,
        bankName: 'Banco Ejemplo',
        accountNumber: '1234567890',
        currency: 'USD',
        balance: 10000
      }
    ],
    movements: [],
    audit: [],
    invoiceSequence: 1
  };
};

const companies: Record<string, CompanyData> = {
  'tenant-1': createSeedCompany('tenant-1', 'Alpha'),
  'tenant-2': createSeedCompany('tenant-2', 'Beta')
};

export const mockDb = {
  getCompany(companyId: string): CompanyData {
    if (!companies[companyId]) {
      companies[companyId] = createSeedCompany(companyId, companyId);
    }
    return companies[companyId];
  }
};

