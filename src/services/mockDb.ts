import type { Client } from '../types/clients';
import type { Vendor } from '../types/vendors';
import type { Invoice } from '../types/invoices';
import type { Bill } from '../types/bills';
import type { BankAccount, BankMovement } from '../types/bankAccounts';
import type { AuditLogEntry } from '../types/audit';
import type { Task } from '../types/tasks';
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
  tasks: Task[];
  invoiceSequence: number;
}

const todayIso = () => new Date().toISOString();

const addDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const createSeedCompany = (companyId: string, name: string): CompanyData => {
  const bankAccountUsdId = generateId();
  const bankAccountMxnId = generateId();
  const clientId = generateId();
  const vendorId = generateId();

  const items = [
    { description: 'Servicio de consultoría', qty: 10, unitPrice: 100, taxRate: 0.16 }
  ];
  const totals = calculateInvoiceTotals(items);

  const invoices: Invoice[] = [
    {
      id: generateId(),
      companyId,
      invoiceNumber: generateInvoiceNumber(1),
      issueDate: todayIso(),
      dueDate: addDays(10),
      customerId: clientId,
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: 'draft'
    },
    {
      id: generateId(),
      companyId,
      invoiceNumber: generateInvoiceNumber(2),
      issueDate: addDays(-1),
      dueDate: addDays(5),
      customerId: clientId,
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: 'issued'
    },
    {
      id: generateId(),
      companyId,
      invoiceNumber: generateInvoiceNumber(3),
      issueDate: addDays(-15),
      dueDate: addDays(-5),
      customerId: clientId,
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: 'issued' // lógica de UI la mostrará como vencida
    },
    {
      id: generateId(),
      companyId,
      invoiceNumber: generateInvoiceNumber(4),
      issueDate: addDays(-20),
      dueDate: addDays(-10),
      customerId: clientId,
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: 'paid'
    },
    {
      id: generateId(),
      companyId,
      invoiceNumber: generateInvoiceNumber(5),
      issueDate: addDays(-30),
      dueDate: addDays(-20),
      customerId: clientId,
      items,
      subtotal: totals.subtotal,
      taxes: totals.taxes,
      total: totals.total,
      status: 'void'
    }
  ];

  const bills: Bill[] = [
    {
      id: generateId(),
      companyId,
      vendorInvoiceNumber: 'BILL-0001',
      issueDate: todayIso(),
      dueDate: addDays(7),
      vendorId,
      total: 500,
      status: 'pending'
    },
    {
      id: generateId(),
      companyId,
      vendorInvoiceNumber: 'BILL-0002',
      issueDate: addDays(-10),
      dueDate: addDays(-3),
      vendorId,
      total: 750,
      status: 'pending' // UI la mostrará como vencida
    },
    {
      id: generateId(),
      companyId,
      vendorInvoiceNumber: 'BILL-0003',
      issueDate: addDays(-15),
      dueDate: addDays(-5),
      vendorId,
      total: 900,
      status: 'paid'
    },
    {
      id: generateId(),
      companyId,
      vendorInvoiceNumber: 'BILL-0004',
      issueDate: addDays(-20),
      dueDate: addDays(-10),
      vendorId,
      total: 300,
      status: 'void'
    }
  ];

  // Seed de movimientos bancarios de ejemplo
  const bankAccounts: BankAccount[] = [
    {
      id: bankAccountUsdId,
      companyId,
      name: `Cuenta USD ${name}`,
      bankName: 'Banco Ejemplo',
      accountNumber: '1234567890',
      currency: 'USD',
      balance: 0 // se actualizará con los movimientos
    },
    {
      id: bankAccountMxnId,
      companyId,
      name: `Cuenta MXN ${name}`,
      bankName: 'Banco Ejemplo MXN',
      accountNumber: '9876543210',
      currency: 'MXN',
      balance: 250000
    }
  ];

  const movements: BankMovement[] = [];
  let currentBalance = 10000;

  // Saldo inicial
  movements.push({
    id: generateId(),
    companyId,
    bankAccountId: bankAccountUsdId,
    date: addDays(-30),
    type: 'income',
    referenceType: 'customerInvoice',
    referenceId: 'saldo-inicial',
    amount: currentBalance,
    resultingBalance: currentBalance
  });

  // Cobro de una factura (income)
  const paidInvoice = invoices.find((i) => i.status === 'paid') ?? invoices[1];
  currentBalance += paidInvoice.total;
  movements.push({
    id: generateId(),
    companyId,
    bankAccountId: bankAccountUsdId,
    date: paidInvoice.issueDate,
    type: 'income',
    referenceType: 'customerInvoice',
    referenceId: paidInvoice.id,
    amount: paidInvoice.total,
    resultingBalance: currentBalance
  });

  // Pago de una factura proveedor (expense)
  const paidBill = bills.find((b) => b.status === 'paid') ?? bills[0];
  currentBalance -= paidBill.total;
  movements.push({
    id: generateId(),
    companyId,
    bankAccountId: bankAccountUsdId,
    date: paidBill.issueDate,
    type: 'expense',
    referenceType: 'vendorBill',
    referenceId: paidBill.id,
    amount: paidBill.total,
    resultingBalance: currentBalance
  });

  // Actualizar saldo final de la cuenta
  bankAccounts[0].balance = currentBalance;

  // Eventos de auditoría de ejemplo
  const audit: AuditLogEntry[] = [];

  audit.push({
    id: generateId(),
    companyId,
    action: 'invoice_created',
    entityId: invoices[1].id,
    entityType: 'invoice',
    message: `Factura ${invoices[1].invoiceNumber} creada`,
    createdAt: invoices[1].issueDate
  });

  audit.push({
    id: generateId(),
    companyId,
    action: 'invoice_paid',
    entityId: paidInvoice.id,
    entityType: 'invoice',
    message: `Factura ${paidInvoice.invoiceNumber} marcada como pagada`,
    createdAt: paidInvoice.issueDate
  });

  audit.push({
    id: generateId(),
    companyId,
    action: 'bill_created',
    entityId: bills[0].id,
    entityType: 'bill',
    message: `Factura proveedor ${bills[0].vendorInvoiceNumber} registrada`,
    createdAt: bills[0].issueDate
  });

  audit.push({
    id: generateId(),
    companyId,
    action: 'bill_paid',
    entityId: paidBill.id,
    entityType: 'bill',
    message: `Factura proveedor ${paidBill.vendorInvoiceNumber} pagada`,
    createdAt: paidBill.issueDate
  });

  // auditar movimientos bancarios
  movements.forEach((m) => {
    audit.push({
      id: generateId(),
      companyId,
      action: 'bank_movement_created',
      entityId: m.id,
      entityType: 'bankMovement',
      message: `Movimiento ${m.type === 'income' ? 'Ingreso' : 'Egreso'} por ${m.amount}`,
      createdAt: m.date
    });
  });

  const tasks: Task[] = [
    {
      id: generateId(),
      companyId,
      title: 'Registrarse como proveedor en aseguradora MX',
      description:
        'Completar alta como proveedor en aseguradora mexicana, incluyendo contratos, KYC y pruebas de integración.',
      category: 'onboarding',
      country: 'México',
      status: 'in_progress',
      createdAt: todayIso(),
      dueDate: addDays(14)
    },
    {
      id: generateId(),
      companyId,
      title: 'Enviar transferencia a EE.UU.',
      description:
        'Preparar transferencia internacional desde la cuenta USD hacia Estados Unidos, validando saldos y tipo de cambio.',
      category: 'banking',
      country: 'Estados Unidos',
      relatedAccountId: bankAccountUsdId,
      status: 'pending',
      createdAt: todayIso(),
      dueDate: addDays(7)
    }
  ];

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
        createdAt: todayIso()
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
        createdAt: todayIso()
      }
    ],
    invoices,
    bills,
    bankAccounts,
    movements,
    audit,
    tasks,
    invoiceSequence: invoices.length
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
